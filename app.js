/**
 * app.js — Student Timetable Finder
 * ------------------------------------------------------------------
 * Storage keys:
 *   ttv:me     -> studentId string   set by "Save as me"
 *   ttv:theme  -> "dark" | "light"   set by the theme toggle
 * ------------------------------------------------------------------
 */

const STORAGE_KEYS = {
  me: 'ttv:me',
  theme: 'ttv:theme'
};

const state = {
  data: null,
  selectedId: null,
  activeSuggestionIndex: -1,
  currentMatches: []
};

// ---------------------------------------------------------------
// Boot
// ---------------------------------------------------------------

async function loadTimetable() {
  // Swap this for `await (await fetch('/api/timetable')).json();`
  // once the real backend/database is connected.
  return TIMETABLE_DATA;
}

async function init() {
  applyStoredTheme();
  state.data = await loadTimetable();

  bindEvents();

  const savedId = window.localStorage.getItem(STORAGE_KEYS.me);
  if (savedId && state.data.students.some(s => s.id === savedId)) {
    selectStudent(savedId, { fromSaved: true });
  }

  window.setInterval(() => {
    if (state.selectedId) refreshNowState();
  }, 60 * 1000);
}

// ---------------------------------------------------------------
// Theme
// ---------------------------------------------------------------

function applyStoredTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  const theme = stored === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle')?.setAttribute('aria-pressed', String(theme === 'dark'));
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  window.localStorage.setItem(STORAGE_KEYS.theme, next);
  document.getElementById('themeToggle').setAttribute('aria-pressed', String(next === 'dark'));
}

// ---------------------------------------------------------------
// Search / suggestions
// ---------------------------------------------------------------

function matchStudents(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return state.data.students.filter(s =>
    s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q)
  );
}

function renderSuggestions(matches) {
  const list = document.getElementById('suggestList');
  const input = document.getElementById('searchInput');
  state.currentMatches = matches;
  state.activeSuggestionIndex = -1;

  if (matches.length === 0) {
    list.hidden = true;
    list.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
    return;
  }

  list.innerHTML = matches.map((s, i) => `
    <li class="suggest-item" data-id="${s.id}" data-index="${i}" role="option">
      <span class="suggest-item__name">${escapeHtml(s.name)}</span>
      <span class="suggest-item__meta">${escapeHtml(s.roll)}</span>
    </li>
  `).join('');
  list.hidden = false;
  input.setAttribute('aria-expanded', 'true');

  list.querySelectorAll('.suggest-item').forEach(item => {
    item.addEventListener('click', () => {
      selectStudent(item.getAttribute('data-id'));
    });
  });
}

function closeSuggestions() {
  const list = document.getElementById('suggestList');
  list.hidden = true;
  document.getElementById('searchInput').setAttribute('aria-expanded', 'false');
}

// ---------------------------------------------------------------
// Selecting a student
// ---------------------------------------------------------------

function selectStudent(id, opts = {}) {
  const student = state.data.students.find(s => s.id === id);
  if (!student) return;

  state.selectedId = id;
  document.getElementById('searchInput').value = student.name;
  closeSuggestions();

  document.getElementById('studentCard').hidden = false;
  document.getElementById('studentName').textContent = student.name;
  document.getElementById('studentMeta').textContent = `Roll: ${student.roll}`;

  document.getElementById('agenda').hidden = false;
  renderAgenda(id);

  const hint = document.getElementById('hint');
  const saved = window.localStorage.getItem(STORAGE_KEYS.me);
  if (opts.fromSaved || saved === id) {
    hint.textContent = 'Showing your saved timetable.';
    hint.classList.add('hint--confirm');
  } else {
    hint.textContent = 'Found it — tap "Save as me" to load this automatically next time.';
    hint.classList.remove('hint--confirm');
  }
}

// ---------------------------------------------------------------
// Save as me / Reset
// ---------------------------------------------------------------

function saveAsMe() {
  if (!state.selectedId) return;
  window.localStorage.setItem(STORAGE_KEYS.me, state.selectedId);
  const hint = document.getElementById('hint');
  hint.textContent = 'Saved — this will load automatically next time you visit.';
  hint.classList.add('hint--confirm');
}

function resetAll() {
  window.localStorage.removeItem(STORAGE_KEYS.me);
  window.localStorage.removeItem(STORAGE_KEYS.theme);

  state.selectedId = null;

  document.getElementById('searchInput').value = '';
  document.getElementById('studentCard').hidden = true;
  document.getElementById('agenda').hidden = true;
  closeSuggestions();

  const hint = document.getElementById('hint');
  hint.textContent = 'Type your name to find your timetable.';
  hint.classList.remove('hint--confirm');

  document.documentElement.setAttribute('data-theme', 'dark');
  document.getElementById('themeToggle').setAttribute('aria-pressed', 'true');

  document.getElementById('settingsPanel').hidden = true;
  document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
}

// ---------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------

function getTodayShort() {
  const map = { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun' };
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short' })
    .format(new Date());
  return map[weekday] || weekday;
}

function getNowMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const h = Number(parts.find(p => p.type === 'hour').value);
  const m = Number(parts.find(p => p.type === 'minute').value);
  return h * 60 + m;
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function formatTimeRange(start, end) {
  return `${format12h(start)} – ${format12h(end)}`;
}

function format12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

// ---------------------------------------------------------------
// Rendering the agenda
// ---------------------------------------------------------------

function renderAgenda(studentId) {
  const agenda = document.getElementById('agenda');
  const schedule = state.data.schedules[studentId] || {};
  const today = getTodayShort();
  const nowMin = getNowMinutes();

  agenda.innerHTML = state.data.days.map(day => {
    const entries = (schedule[day] || []).slice().sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    const isToday = day === today;

    const rows = entries.length === 0
      ? '<div class="day-card__empty">No classes scheduled.</div>'
      : entries.map(cls => {
          const isNow = isToday && nowMin >= toMinutes(cls.start) && nowMin < toMinutes(cls.end);
          return `
            <div class="class-row ${isNow ? 'is-now' : ''}" data-day="${day}" data-start="${cls.start}" data-end="${cls.end}">
              <div class="class-row__time">${formatTimeRange(cls.start, cls.end)}</div>
              <div class="class-row__main">
                <span class="class-row__code">${escapeHtml(cls.code)}</span><span class="class-row__type">${escapeHtml(cls.type)}</span>
                <span class="class-row__now-tag" ${isNow ? '' : 'hidden'}>Now</span>
              </div>
              <div class="class-row__room">📍 ${escapeHtml(cls.room)}</div>
            </div>`;
        }).join('');

    return `
      <div class="day-card">
        <div class="day-card__header">
          <h3 class="day-card__title">${day}</h3>
          <span class="day-card__badge ${isToday ? 'day-card__badge--today' : ''}">${isToday ? 'Today' : 'Weekday'}</span>
        </div>
        ${rows}
      </div>`;
  }).join('');
}

// Called every minute. Toggles is-now state on existing rows instead of
// rebuilding the agenda, so CSS entrance animations only play once.
function refreshNowState() {
  const today = getTodayShort();
  const nowMin = getNowMinutes();

  document.querySelectorAll('.class-row').forEach(row => {
    const isToday = row.getAttribute('data-day') === today;
    const start = toMinutes(row.getAttribute('data-start'));
    const end = toMinutes(row.getAttribute('data-end'));
    const isNow = isToday && nowMin >= start && nowMin < end;

    row.classList.toggle('is-now', isNow);
    const tag = row.querySelector('.class-row__now-tag');
    if (tag) tag.hidden = !isNow;
  });

  document.querySelectorAll('.day-card').forEach(card => {
    const title = card.querySelector('.day-card__title')?.textContent;
    const badge = card.querySelector('.day-card__badge');
    if (!badge || !title) return;
    const isToday = title === today;
    badge.textContent = isToday ? 'Today' : 'Weekday';
    badge.classList.toggle('day-card__badge--today', isToday);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---------------------------------------------------------------
// Events
// ---------------------------------------------------------------

function bindEvents() {
  const input = document.getElementById('searchInput');

  input.addEventListener('input', () => {
    renderSuggestions(matchStudents(input.value));
  });

  input.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.suggest-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.activeSuggestionIndex = Math.min(state.activeSuggestionIndex + 1, items.length - 1);
      updateActiveSuggestion(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.activeSuggestionIndex = Math.max(state.activeSuggestionIndex - 1, 0);
      updateActiveSuggestion(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const active = state.currentMatches[state.activeSuggestionIndex] || state.currentMatches[0];
      if (active) selectStudent(active.id);
    } else if (e.key === 'Escape') {
      closeSuggestions();
    }
  });

  document.addEventListener('click', (e) => {
    const field = document.querySelector('.search-field');
    if (!field.contains(e.target)) closeSuggestions();
  });

  document.getElementById('saveMeBtn').addEventListener('click', saveAsMe);

  document.getElementById('menuBtn').addEventListener('click', () => {
    const panel = document.getElementById('settingsPanel');
    const btn = document.getElementById('menuBtn');
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    btn.setAttribute('aria-expanded', String(isHidden));
  });

  document.addEventListener('click', (e) => {
    const panel = document.getElementById('settingsPanel');
    const btn = document.getElementById('menuBtn');
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.getElementById('resetBtn').addEventListener('click', resetAll);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function updateActiveSuggestion(items) {
  items.forEach(item => item.classList.remove('is-active'));
  const active = items[state.activeSuggestionIndex];
  if (active) {
    active.classList.add('is-active');
    active.scrollIntoView({ block: 'nearest' });
  }
}

document.addEventListener('DOMContentLoaded', init);