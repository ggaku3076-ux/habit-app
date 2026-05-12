const checkIcon = '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.1 4.1L19 7"/></svg>';
const habitIcon = '<svg viewBox="0 0 24 24"><path d="M12 3s5.5 4.7 5.5 10a5.5 5.5 0 0 1-11 0C6.5 7.7 12 3 12 3Z"/><path d="M9.7 15.2c.6.8 1.4 1.2 2.5 1.2"/></svg>';
const STORAGE_KEY = 'habitly-habits-v1';
const DAILY_HISTORY_KEY = 'habitly-daily-history-v1';
const TODO_STORAGE_KEY = 'habitly-daily-schedule-v1';

const HABIT_ICONS = [
  '💧','🏋️','🌙','📚','🧘','🚶','🏃','🥗','🍎','🥛',
  '☕','📝','🎯','⭐','🔥','🌿','🌱','🌻','🌞','🌈',
  '🧠','💪','❤️','🫀','🫁','🦷','🛌','⏰','📅','✅',
  '🧹','🧺','🍳','🥘','🍽️','🛒','💊','🧴','🚿','🪥',
  '💻','⌨️','🎧','🎵','🎨','📷','🎬','🎮','🧩','♟️',
  '💰','📈','📊','🧾','🏦','💡','🔋','🔒','📌','📍',
  '✈️','🚲','🚗','🚌','🏠','🪴','🐾','🐱','🐶','🦋',
  '🍀','🌊','⛰️','🏖️','🌌','🕯️','🙏','💬','📞','✉️',
  '🔔','🎁','🏆','🥇','🎓','🧪','🔬','🧵','🛠️','🧰',
  '⚽','🏀','🏸','🏊','🧗','🥾','🧊','🍵','🫖','🕊️'
];

const app = document.querySelector('.app');
const todayDate = document.querySelector('.today-date');
const progressText = document.querySelector('.progress-row strong');
const percentText = document.querySelector('.percent');
const segmentsContainer = document.querySelector('.segments');
const habitStat = document.querySelector('.stats-grid article:first-child b');
const weeklyStat = document.querySelector('.stats-grid article:nth-child(2) b');
const pointsStat = document.querySelector('.stats-grid article:nth-child(3) b');
const addButton = document.querySelector('.add-btn');
const habitList = document.querySelector('.habit-list');
const todoList = document.querySelector('.todo-list');
const editToggle = document.querySelector('.habit-edit-toggle');
const todoEditToggle = document.querySelector('.todo-edit-toggle');
const addTodoButton = document.querySelector('.add-todo');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const statsDate = document.querySelector('.stats-date');
const levelName = document.querySelector('.level-name');
const levelBar = document.querySelector('.level-bar');
const levelNext = document.querySelector('.level-next');
const weeklyPagePercent = document.querySelector('.weekly-page-percent');
const weeklyCompleted = document.querySelector('.weekly-completed');
const bestDay = document.querySelector('.best-day');
const targetText = document.querySelector('.target-text');
const targetBar = document.querySelector('.target-bar');
const weekChart = document.querySelector('.week-chart');
const completedHabitsStat = document.querySelector('.completed-habits');
const pendingHabitsStat = document.querySelector('.pending-habits');
const scheduleDoneStat = document.querySelector('.schedule-done');
const streakBadge = document.querySelector('.streak-badge');
const weeklyBadge = document.querySelector('.weekly-badge');
const sheet = document.querySelector('.add-sheet');
const backdrop = document.querySelector('.sheet-backdrop');
const closeSheetButton = document.querySelector('.sheet-close');
const habitForm = document.querySelector('.habit-form');
const sheetEyebrow = document.querySelector('.sheet-head p');
const sheetTitle = document.querySelector('.sheet-head h2');
const sheetNameLabel = document.querySelector('.name-field span');
const sheetNameInput = document.querySelector('.name-field input');
const sheetGoalLabel = document.querySelector('.goal-field span');
const sheetGoalInput = document.querySelector('.goal-field input');
const saveButton = document.querySelector('.save-habit');
const iconPicker = document.querySelector('.icon-picker');
const iconGrid = document.querySelector('.icon-grid');
const iconPickerClose = document.querySelector('.icon-picker-close');
let activeIconCard = null;
let sheetMode = 'habit';
let isEditingHabits = false;
let isEditingTodos = false;
let animatedPercent = 0;
let percentAnimationId = null;
let activeDateKey = getTodayKey();


const initialViewportHeight = window.innerHeight;

function updateKeyboardOffset(forceOpen = false) {
  const active = document.activeElement;
  const inputFocused = !!(active && active.matches && active.matches('input, textarea, select'));
  const viewport = window.visualViewport;
  const visualHeight = viewport ? viewport.height : window.innerHeight;
  const visualTop = viewport ? viewport.offsetTop : 0;
  const keyboardOffset = Math.max(0, initialViewportHeight - visualHeight - visualTop, window.innerHeight - visualHeight - visualTop);
  document.documentElement.style.setProperty('--keyboard-offset', `${Math.round(keyboardOffset)}px`);
  document.body.classList.toggle('keyboard-open', forceOpen || inputFocused || keyboardOffset > 60);
}

function keepFocusedInputVisible() {
  const active = document.activeElement;
  if (!active || !sheet || !sheet.classList.contains('open')) return;
  if (!active.matches('input, textarea, select')) return;
  updateKeyboardOffset(true);
  setTimeout(() => {
    active.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    sheet.scrollTo({ top: Math.max(0, active.offsetTop - 80), behavior: 'smooth' });
  }, 80);
}

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', updateKeyboardOffset);
  window.visualViewport.addEventListener('scroll', updateKeyboardOffset);
}
window.addEventListener('resize', updateKeyboardOffset);
document.addEventListener('focusin', () => {
  updateKeyboardOffset(true);
  keepFocusedInputVisible();
  setTimeout(() => updateKeyboardOffset(true), 180);
  setTimeout(keepFocusedInputVisible, 360);
});
document.addEventListener('focusout', () => {
  setTimeout(() => {
    const active = document.activeElement;
    if (!active || !active.matches || !active.matches('input, textarea, select')) {
      document.body.classList.remove('keyboard-open');
      document.documentElement.style.setProperty('--keyboard-offset', '0px');
    }
  }, 180);
});


function handleAppButtonClick(event) {
  const target = event.target;

  if (target === backdrop) {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeSheet();
    return;
  }

  if (target === iconPicker) {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeIconPicker();
    return;
  }

  const button = target.closest('button, .icon-bubble');
  if (!button || !app.contains(button)) return;

  const stop = () => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  if (button.closest('.add-btn')) {
    stop();
    openSheet('habit');
    return;
  }

  if (button.closest('.habit-edit-toggle')) {
    stop();
    toggleHabitEditor();
    return;
  }

  if (button.closest('.todo-edit-toggle')) {
    stop();
    toggleTodoEditor();
    return;
  }

  if (button.closest('.add-todo')) {
    stop();
    addDailySchedule();
    return;
  }

  const nav = button.closest('.nav-item');
  if (nav) {
    stop();
    showPage(nav.dataset.target || 'home');
    return;
  }

  if (button.closest('.sheet-close')) {
    stop();
    closeSheet();
    return;
  }

  if (button.closest('.icon-picker-close')) {
    stop();
    closeIconPicker();
    return;
  }

  const iconOption = button.closest('.icon-option');
  if (iconOption) {
    stop();
    chooseHabitIcon(iconOption.textContent.trim());
    return;
  }

  const editIcon = button.closest('.edit-icon-btn');
  if (editIcon) {
    stop();
    const card = editIcon.closest('.habit-card');
    if (card) openIconPicker(card);
    return;
  }

  const iconBubble = button.closest('.icon-bubble');
  if (iconBubble) {
    if (!isEditingHabits) return;
    stop();
    const card = iconBubble.closest('.habit-card');
    if (card) openIconPicker(card);
    return;
  }

  const habitCheck = button.closest('.check');
  if (habitCheck) {
    stop();
    if (isEditingHabits) return;
    const card = habitCheck.closest('.habit-card');
    habitCheck.classList.toggle('checked');
    if (card) card.dataset.checkedDate = habitCheck.classList.contains('checked') ? getTodayKey() : '';
    habitCheck.innerHTML = habitCheck.classList.contains('checked') ? checkIcon : '';
    saveHabits();
    updateProgress();
    return;
  }

  const habitDelete = button.closest('.delete-habit');
  if (habitDelete) {
    stop();
    const card = habitDelete.closest('.habit-card');
    if (card) removeCard(card, () => {
      saveHabits();
      updateProgress();
    });
    return;
  }

  const todoCheck = button.closest('.todo-check');
  if (todoCheck) {
    stop();
    const card = todoCheck.closest('.todo-card');
    if (!card) return;
    card.classList.toggle('done');
    todoCheck.innerHTML = card.classList.contains('done') ? checkIcon : '';
    saveTodos();
    updateProgress();
    return;
  }

  const todoDelete = button.closest('.delete-todo');
  if (todoDelete) {
    stop();
    const card = todoDelete.closest('.todo-card');
    if (card) removeCard(card, () => {
      saveTodos();
      updateProgress();
    });
  }
}

function setTodayDate() {
  const formatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  todayDate.textContent = formatted;
}

function bindHabitCard(card) {
  const check = card.querySelector('.check');
  const remove = card.querySelector('.delete-habit');
  const title = card.querySelector('h3');
  const goal = card.querySelector('p');
  const bubble = card.querySelector('.icon-bubble');

  ensureHabitIcon(card);
  ensureIconEditButton(card);

  bubble.addEventListener('click', () => {
    if (!isEditingHabits) return;
    openIconPicker(card);
  });

  if (check.classList.contains('checked') && !card.dataset.checkedDate) {
    card.dataset.checkedDate = getTodayKey();
  }

  check.addEventListener('click', () => {
    if (isEditingHabits) return;
    check.classList.toggle('checked');
    card.dataset.checkedDate = check.classList.contains('checked') ? getTodayKey() : '';
    check.innerHTML = check.classList.contains('checked') ? checkIcon : '';
    saveHabits();
    updateProgress();
  });

  remove.addEventListener('click', () => {
    removeCard(card, () => {
      saveHabits();
      updateProgress();
    });
  });

  [title, goal].forEach((field) => {
    field.addEventListener('input', saveHabits);
    field.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        field.blur();
      }
    });
  });
}

function bindTodoCard(card) {
  const check = card.querySelector('.todo-check');
  const text = card.querySelector('span');
  const remove = card.querySelector('.delete-todo');

  check.addEventListener('click', () => {
    if (isEditingTodos) return;
    card.classList.toggle('done');
    check.innerHTML = card.classList.contains('done') ? checkIcon : '';
    saveTodos();
    updateProgress();
  });

  remove.addEventListener('click', () => {
    removeCard(card, () => {
      saveTodos();
      updateProgress();
    });
  });

  text.addEventListener('input', saveTodos);
  text.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      text.blur();
    }
  });
}

function updateProgress() {
  const habits = document.querySelectorAll('.habit-card');
  const todos = document.querySelectorAll('.todo-card');
  const total = Math.max(habits.length + todos.length, 1);
  const checkedHabits = document.querySelectorAll('.habit-card .check.checked').length;
  const checkedTodos = document.querySelectorAll('.todo-card.done .todo-check').length;
  const completed = Math.min(checkedHabits + checkedTodos, total);
  const percent = Math.round((completed / total) * 100);

  progressText.innerHTML = `<b>${completed}</b> / ${total} completed`;
  animateProgressPercent(percent);
  segmentsContainer.setAttribute('aria-label', `Daily progress ${percent}%`);
  if (habitStat) habitStat.textContent = habits.length;
  updateStats(total, completed, percent);

  renderProgressSegments(total, completed);
}

function animateProgressPercent(targetPercent) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (percentAnimationId) cancelAnimationFrame(percentAnimationId);

  if (reduceMotion) {
    animatedPercent = targetPercent;
    percentText.textContent = `${targetPercent}%`;
    percentText.style.setProperty('--progress', `${targetPercent}%`);
    return;
  }

  const startPercent = animatedPercent;
  const difference = targetPercent - startPercent;
  const duration = 520;
  const startedAt = performance.now();

  percentText.classList.remove('pop');
  void percentText.offsetWidth;
  percentText.classList.add('pop');

  function tick(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(startPercent + difference * eased);

    animatedPercent = value;
    percentText.textContent = `${value}%`;
    percentText.style.setProperty('--progress', `${value}%`);

    if (progress < 1) {
      percentAnimationId = requestAnimationFrame(tick);
    } else {
      animatedPercent = targetPercent;
      percentText.textContent = `${targetPercent}%`;
      percentText.style.setProperty('--progress', `${targetPercent}%`);
      percentAnimationId = null;
    }
  }

  percentAnimationId = requestAnimationFrame(tick);
}

function updateStats(total, completed, percent) {
  saveTodayProgress(percent);

  const weeklyAverage = getWeeklyAverage();
  const points = completed * 10;

  if (weeklyStat) weeklyStat.textContent = `${weeklyAverage}%`;
  if (pointsStat) pointsStat.textContent = points;
  renderStatisticsPage({ total, completed, percent, weeklyAverage, points });
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return formatDateKey(new Date());
}

function refreshDailyState() {
  const today = getTodayKey();
  if (today === activeDateKey) return;

  activeDateKey = today;
  renderIconPicker();
setTodayDate();

  document.querySelectorAll('.habit-card').forEach((card) => {
    const check = card.querySelector('.check');
    if (card.dataset.checkedDate !== today) {
      card.dataset.checkedDate = '';
      check.classList.remove('checked');
      check.innerHTML = '';
    }
  });

  document.querySelectorAll('.todo-card').forEach((card) => {
    card.classList.remove('done');
    card.querySelector('.todo-check').innerHTML = '';
  });

  saveHabits();
  saveTodos();
  updateProgress();
}

function saveTodayProgress(percent) {
  const history = getProgressHistory();
  history[getTodayKey()] = percent;
  localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
}

function getProgressHistory() {
  try {
    return JSON.parse(localStorage.getItem(DAILY_HISTORY_KEY)) || {};
  } catch {
    return {};
  }
}

function getWeeklyAverage() {
  const history = getProgressHistory();
  const today = new Date();
  const values = [];

  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = formatDateKey(date);
    if (typeof history[key] === 'number') values.push(history[key]);
  }

  if (!values.length) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function getLastSevenDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });
}

function renderStatisticsPage({ total, completed, percent, weeklyAverage, points }) {
  if (!weekChart) return;

  const habits = [...document.querySelectorAll('.habit-card')];
  const todosDone = document.querySelectorAll('.todo-card.done').length;
  const completedHabits = habits.filter((card) => card.querySelector('.check').classList.contains('checked')).length;
  const pendingHabits = Math.max(habits.length - completedHabits, 0);
  const level = getConsistencyLevel(points);
  const days = getLastSevenDays();
  const history = getProgressHistory();
  const todayKey = getTodayKey();
  let best = { label: 'Today', value: percent };
  let weeklyDone = 0;

  statsDate.textContent = todayDate.textContent;
  levelName.textContent = `Level ${level.number} • ${level.name}`;
  levelBar.style.setProperty('--level-progress', `${level.progress}%`);
  levelNext.textContent = level.nextText;
  targetText.textContent = `${completed} / ${total} completed`;
  targetBar.style.setProperty('--target-progress', `${percent}%`);
  weeklyPagePercent.textContent = `${weeklyAverage}%`;
  weeklyCompleted.textContent = completed;
  completedHabitsStat.textContent = completedHabits;
  pendingHabitsStat.textContent = pendingHabits;
  scheduleDoneStat.textContent = todosDone;
  streakBadge.textContent = `🔥 ${getStreakDays(history, todayKey, percent)} days streak`;
  weeklyBadge.textContent = `🌿 Weekly ${weeklyAverage}%`;

  weekChart.innerHTML = '';
  days.forEach((date) => {
    const key = formatDateKey(date);
    const isToday = key === todayKey;
    const value = isToday ? percent : Number(history[key] || 0);
    const label = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date).slice(0, 3);

    if (value > best.value || isToday) best = value >= best.value ? { label: isToday ? 'Today' : label, value } : best;
    if (value > 0) weeklyDone += Math.round((value / 100) * Math.max(total, 1));

    const day = document.createElement('div');
    day.className = `chart-day${isToday ? ' today' : ''}`;
    day.innerHTML = `<i class="chart-bar" style="--bar-height: ${Math.max(value, 6)}%"></i><span>${label}</span>`;
    weekChart.appendChild(day);
  });

  weeklyCompleted.textContent = weeklyDone;
  bestDay.textContent = best.label;
}

function getConsistencyLevel(points) {
  const levels = ['Fresh Starter', 'Tiny Builder', 'Routine Maker', 'Steady Grower', 'Consistency Pro'];
  const number = Math.min(Math.floor(points / 10) + 1, 5);
  const currentMin = (number - 1) * 10;
  const nextTarget = number >= 5 ? 50 : number * 10;
  const progress = number >= 5 ? 100 : Math.round(((points - currentMin) / 10) * 100);
  const nextText = number >= 5 ? `${points} points • max level reached` : `${points} / ${nextTarget} points to next level`;
  return { number, name: levels[number - 1], progress, nextText };
}

function getStreakDays(history, todayKey, todayPercent) {
  const today = new Date(todayKey);
  let streak = todayPercent > 0 ? 1 : 0;

  for (let offset = 1; offset < 30; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = formatDateKey(date);
    if (Number(history[key] || 0) <= 0) break;
    streak += 1;
  }

  return streak;
}

function renderProgressSegments(total, completed) {
  segmentsContainer.innerHTML = '';

  for (let index = 0; index < total; index += 1) {
    const segment = document.createElement('i');
    segment.style.setProperty('--delay', `${Math.min(index * 22, 140)}ms`);
    segment.classList.toggle('filled', index < completed);
    segmentsContainer.appendChild(segment);
  }
}

function removeCard(card, afterRemove) {
  card.classList.add('is-removing');
  card.addEventListener('animationend', () => {
    card.remove();
    afterRemove();
  }, { once: true });
}

function showPage(target) {
  pages.forEach((page) => {
    page.classList.toggle('active-page', page.dataset.page === target);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.target === target);
  });

  if (target === 'stats') updateProgress();
}

function openSheet(mode = 'habit') {
  sheetMode = mode;
  configureSheet(mode);
  backdrop.hidden = false;
  sheet.setAttribute('aria-hidden', 'false');
  updateKeyboardOffset();
  requestAnimationFrame(() => {
    sheet.classList.add('open');
    keepFocusedInputVisible();
  });
  addButton.classList.add('pulse');
  setTimeout(() => addButton.classList.remove('pulse'), 280);
}

function configureSheet(mode) {
  const isTodo = mode === 'todo';

  sheetEyebrow.textContent = isTodo ? 'Daily schedule' : 'New habit';
  sheetTitle.textContent = isTodo ? 'Add schedule' : 'Create routine';
  sheetNameLabel.textContent = isTodo ? 'Schedule name' : 'Habit name';
  sheetNameInput.placeholder = isTodo ? 'Study session' : 'Morning walk';
  sheetGoalLabel.textContent = isTodo ? 'Time / note' : 'Reminder / goal';
  sheetGoalInput.placeholder = isTodo ? '19:00 every day' : '20 min at 07:00';
  sheetGoalInput.required = !isTodo;
  saveButton.textContent = isTodo ? 'Add schedule' : 'Add habit';
}

function closeSheet() {
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  document.documentElement.style.setProperty('--keyboard-offset', '0px');
  document.body.classList.remove('keyboard-open');
  setTimeout(() => { backdrop.hidden = true; }, 220);
}

function createHabit(name, goal, checkedDate = '', prepend = true, shouldSave = true, icon = '🌿') {
  const isDoneToday = checkedDate === getTodayKey() || checkedDate === true;
  const card = document.createElement('article');
  card.className = 'habit-card is-new';
  card.dataset.checkedDate = isDoneToday ? getTodayKey() : '';
  card.innerHTML = `
    <div class="icon-bubble" role="button" aria-label="Pilih icon habit"><span class="habit-icon">${escapeHtml(icon)}</span></div>
    <div class="habit-copy">
      <h3>${escapeHtml(name)}</h3>
      <p>${escapeHtml(goal)}</p>
      <button class="edit-icon-btn" type="button" aria-label="Ganti icon ${escapeHtml(name)}">Icon</button>
    </div>
    <button class="check ${isDoneToday ? 'checked' : ''}" aria-label="Tandai ${escapeHtml(name)} selesai">${isDoneToday ? checkIcon : ''}</button>
    <button class="delete-habit" type="button" aria-label="Hapus ${escapeHtml(name)}">×</button>
  `;

  habitList[prepend ? 'prepend' : 'append'](card);
  bindHabitCard(card);
  applyHabitEditState(card);
  if (shouldSave) saveHabits();
  updateProgress();
}

function applyHabitEditState(scope = document) {
  scope.querySelectorAll('.habit-copy h3, .habit-copy p').forEach((field) => {
    field.contentEditable = isEditingHabits ? 'true' : 'false';
  });
}

function toggleHabitEditor() {
  isEditingHabits = !isEditingHabits;
  app.classList.toggle('editing-habits', isEditingHabits);
  editToggle.textContent = isEditingHabits ? 'Done' : 'View all';
  editToggle.setAttribute('aria-pressed', String(isEditingHabits));
  applyHabitEditState();
  document.querySelectorAll('.habit-card').forEach((card) => {
    ensureHabitIcon(card);
    ensureIconEditButton(card);
  });

  if (!isEditingHabits) {
    saveHabits();
  }
}

function getHabits() {
  return [...document.querySelectorAll('.habit-card')].map((card) => ({
    name: card.querySelector('h3').textContent.trim() || 'Untitled habit',
    goal: card.querySelector('p').textContent.trim() || 'No goal yet',
    checkedDate: card.querySelector('.check').classList.contains('checked') ? (card.dataset.checkedDate || getTodayKey()) : '',
    icon: card.dataset.icon || card.querySelector('.habit-icon')?.textContent || '🌿'
  }));
}

function ensureIconEditButton(card) {
  if (card.querySelector('.edit-icon-btn')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'edit-icon-btn';
  button.textContent = 'Icon';
  button.setAttribute('aria-label', 'Ganti icon habit');
  button.addEventListener('click', () => openIconPicker(card));
  card.querySelector('.habit-copy').appendChild(button);
}

function ensureHabitIcon(card) {
  const bubble = card.querySelector('.icon-bubble');
  if (!bubble) return;

  const current = card.dataset.icon || bubble.querySelector('.habit-icon')?.textContent || pickDefaultIcon(card.querySelector('h3')?.textContent || '');
  card.dataset.icon = current;
  bubble.setAttribute('role', 'button');
  bubble.setAttribute('aria-label', 'Pilih icon habit');
  bubble.innerHTML = `<span class="habit-icon">${current}</span>`;
}

function pickDefaultIcon(name) {
  const value = name.toLowerCase();
  if (value.includes('water') || value.includes('drink')) return '💧';
  if (value.includes('workout') || value.includes('exercise')) return '🏋️';
  if (value.includes('sleep')) return '🌙';
  return '🌿';
}

function renderIconPicker() {
  iconGrid.innerHTML = '';
  HABIT_ICONS.forEach((icon) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-option';
    button.textContent = icon;
    button.setAttribute('aria-label', `Pilih icon ${icon}`);
    button.addEventListener('click', () => chooseHabitIcon(icon));
    iconGrid.appendChild(button);
  });
}

function openIconPicker(card) {
  activeIconCard = card;
  iconPicker.classList.add('open');
  iconPicker.setAttribute('aria-hidden', 'false');
}

function closeIconPicker() {
  iconPicker.classList.remove('open');
  iconPicker.setAttribute('aria-hidden', 'true');
  activeIconCard = null;
}

window.openHabitIconPicker = (index = 0) => {
  const card = document.querySelectorAll('.habit-card')[index];
  if (card) openIconPicker(card);
};

function chooseHabitIcon(icon) {
  if (!activeIconCard) return;
  activeIconCard.dataset.icon = icon;
  activeIconCard.querySelector('.icon-bubble').innerHTML = `<span class="habit-icon">${icon}</span>`;
  saveHabits();
  closeIconPicker();
}

function applyTodoEditState(scope = document) {
  scope.querySelectorAll('.todo-card span').forEach((field) => {
    field.contentEditable = isEditingTodos ? 'true' : 'false';
  });
}

function toggleTodoEditor() {
  isEditingTodos = !isEditingTodos;
  app.classList.toggle('editing-todos', isEditingTodos);
  todoEditToggle.textContent = isEditingTodos ? 'Done' : 'View all';
  todoEditToggle.setAttribute('aria-pressed', String(isEditingTodos));
  applyTodoEditState();
  if (!isEditingTodos) saveTodos();
}

function createTodo(text, checkedDate = '', shouldSave = true) {
  const isDoneToday = checkedDate === getTodayKey();
  const card = document.createElement('article');
  card.className = `todo-card is-new${isDoneToday ? ' done' : ''}`;
  card.innerHTML = `<button class="todo-check" aria-label="Tandai ${escapeHtml(text)}"></button><span>${escapeHtml(text)}</span><button class="delete-todo" type="button" aria-label="Hapus ${escapeHtml(text)}">×</button>`;
  card.querySelector('.todo-check').innerHTML = isDoneToday ? checkIcon : '';
  todoList.appendChild(card);
  bindTodoCard(card);
  applyTodoEditState(card);
  if (shouldSave) saveTodos();
  updateProgress();
}

function addDailySchedule() {
  openSheet('todo');
}

function getTodos() {
  return [...document.querySelectorAll('.todo-card')].map((card) => ({
    text: card.querySelector('span').textContent.trim() || 'Untitled schedule',
    checkedDate: card.classList.contains('done') ? getTodayKey() : ''
  }));
}

function saveTodos() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(getTodos()));
}

function loadTodos() {
  const saved = localStorage.getItem(TODO_STORAGE_KEY);
  if (!saved) return false;

  try {
    const todos = JSON.parse(saved);
    if (!Array.isArray(todos)) return false;
    todoList.innerHTML = '';
    todos.forEach((todo) => createTodo(todo.text, todo.checkedDate, false));
    saveTodos();
    return true;
  } catch {
    return false;
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getHabits()));
}

function loadHabits() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;

  try {
    const habits = JSON.parse(saved);
    if (!Array.isArray(habits)) return false;
    habitList.innerHTML = '';
    habits.forEach((habit) => createHabit(habit.name, habit.goal, habit.checkedDate || (habit.checked ? getTodayKey() : ''), false, false, habit.icon || '🌿'));
    saveHabits();
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

setTodayDate();
const loadedSavedHabits = loadHabits();
if (!loadedSavedHabits) {
  document.querySelectorAll('.habit-card').forEach(bindHabitCard);
  saveHabits();
}
const loadedSavedTodos = loadTodos();
if (!loadedSavedTodos) {
  document.querySelectorAll('.todo-card').forEach(bindTodoCard);
  saveTodos();
}

habitList.addEventListener('click', (event) => {
  const iconButton = event.target.closest('.edit-icon-btn');
  if (!iconButton) return;
  const card = iconButton.closest('.habit-card');
  if (card) openIconPicker(card);
});
addButton.addEventListener('click', () => openSheet('habit'));
editToggle.addEventListener('click', toggleHabitEditor);
todoEditToggle.addEventListener('click', toggleTodoEditor);
addTodoButton.addEventListener('click', addDailySchedule);
navItems.forEach((item) => item.addEventListener('click', () => showPage(item.dataset.target)));
closeSheetButton.addEventListener('click', closeSheet);
backdrop.addEventListener('click', closeSheet);
iconPickerClose.addEventListener('click', closeIconPicker);
iconPicker.addEventListener('click', (event) => {
  if (event.target === iconPicker) closeIconPicker();
});

habitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(habitForm);
  const name = data.get('name').trim();
  const goal = data.get('goal').trim();

  if (sheetMode === 'todo') {
    createTodo(goal ? `${name} • ${goal}` : name);
  } else {
    createHabit(name, goal);
  }

  habitForm.reset();
  closeSheet();
});

document.addEventListener('click', handleAppButtonClick, true);
setInterval(refreshDailyState, 60 * 1000);
updateProgress();
