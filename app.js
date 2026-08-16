/**
 * app.js
 */

const STORAGE_KEYS = { theme: 'ttv:theme' };
const state = { data: null };

async function loadTimetable() {
  return window.TIMETABLE_DATA;
}

async function init() {
  applyStoredTheme();
  state.data = await loadTimetable();
  bindEvents();
  renderAgenda();

  window.setInterval(() => {
    refreshNowState();
  }, 60 * 1000);
}

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

function getTodayShort() {
  const map = { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun' };
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(new Date());
  return map[weekday] || weekday;
}

function getNowMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
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

function renderAgenda() {
  const agenda = document.getElementById('agenda');
  if (!agenda) return;

  agenda.hidden = false;
  agenda.style.display = 'block';

  const schedule = state.data.schedule || {};
  const days = state.data.days || ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const today = getTodayShort();
  const nowMin = getNowMinutes();

  agenda.innerHTML = days.map(day => {
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

function bindEvents() {
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

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
}

document.addEventListener('DOMContentLoaded', init);
