#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SDK="${ANDROID_SDK_ROOT:-/home/LxArc/.openclaw/devtools/android-sdk}"
JDK="${JAVA_HOME:-/home/LxArc/.openclaw/devtools/jdk}"
BT="$SDK/build-tools/35.0.0"
ANDROID_JAR="$SDK/platforms/android-35/android.jar"

export PATH="$JDK/bin:$BT:$PATH"

OUT="$ROOT/out"
GEN="$OUT/gen"
CLASSES="$OUT/classes"
DEX="$OUT/dex"
UNSIGNED="$OUT/habitly-unsigned.apk"
ALIGNED="$OUT/habitly-aligned.apk"
FINAL="$ROOT/../habitly-debug.apk"
FINAL_IDSIG="$FINAL.idsig"
KEYSTORE="$ROOT/debug.keystore"

rm -rf "$OUT"
mkdir -p "$GEN" "$CLASSES" "$DEX"

if [[ ! -f "$KEYSTORE" ]]; then
  keytool -genkeypair -v \
    -keystore "$KEYSTORE" \
    -storepass android \
    -alias androiddebugkey \
    -keypass android \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -dname "CN=Android Debug,O=Android,C=US"
fi

aapt package -f -m \
  -J "$GEN" \
  -M "$ROOT/AndroidManifest.xml" \
  -S "$ROOT/res" \
  -A "$ROOT/assets" \
  -I "$ANDROID_JAR" \
  -F "$UNSIGNED"

mapfile -d '' JAVA_SOURCES < <(find "$ROOT/src" "$GEN" -name '*.java' -print0)
javac -source 1.8 -target 1.8 \
  -bootclasspath "$ANDROID_JAR" \
  -classpath "$ANDROID_JAR" \
  -d "$CLASSES" \
  "${JAVA_SOURCES[@]}"

mapfile -d '' CLASS_FILES < <(find "$CLASSES" -name '*.class' -print0)
d8 --min-api 23 \
  --classpath "$ANDROID_JAR" \
  --output "$DEX" \
  "${CLASS_FILES[@]}"

# Add classes.dex to the packaged resource APK.
python - "$UNSIGNED" "$DEX/classes.dex" <<'PY'
import sys, zipfile
apk, dex = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(apk, 'a', compression=zipfile.ZIP_STORED) as z:
    z.write(dex, 'classes.dex')
PY

zipalign -f -p 4 "$UNSIGNED" "$ALIGNED"

apksigner sign \
  --ks "$KEYSTORE" \
  --ks-key-alias androiddebugkey \
  --ks-pass pass:android \
  --key-pass pass:android \
  --out "$FINAL" \
  "$ALIGNED"

rm -f "$FINAL_IDSIG"
apksigner verify --verbose --print-certs "$FINAL"

echo "Built: $FINAL"
