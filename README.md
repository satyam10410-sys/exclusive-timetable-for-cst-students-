# Student Timetable Finder — IIT Patna CST

A static, dependency-free frontend, ready to deploy straight to Vercel.
Search a student by name, see their merged personal weekly timetable.

## Files

- `index.html` — page structure
- `styles.css` — styling (dark by default, light theme via `[data-theme="light"]`)
- `app.js` — search, suggestions, agenda rendering, save/reset, theme toggle
- `data.js` — **placeholder/sample** data (one real student — Satyam Kumar — plus one dummy)

## Features

- **Search by name or roll number** with a live suggestions dropdown
- Personal **student card** (name, roll, group)
- **Weekday agenda cards** — time, course code + type (Theory/Lab/Tutorial), room
- Current class auto-highlighted with a "Now" tag (IST-aware)
- **Save as me** — remembers the selected student in `localStorage`, auto-loads next visit
- **Reset** (in the ☰ menu) — clears saved student + theme
- **Dark/light toggle** (in the ☰ menu) — persists across visits

## Current data

`data.js` now contains all **41 real CST students** from `CST_ATTENDANCE_SHEET.xlsx`
(roll no. + name), each pointing at the same `SHARED_SCHEDULE` object — the chem
timetable you confirmed is identical for everyone. Student IDs are derived from
roll number, e.g. `2501CT06` → `s-2501ct06`.

There's no "group" column in this sheet, so that field has been dropped from the
UI for now. If a future sheet distinguishes students (different electives, labs,
etc.), just give the relevant students their own entry in `schedules` instead of
pointing them all at `SHARED_SCHEDULE`.

## Connecting the real database

`data.js` exports `TIMETABLE_DATA` shaped like this:

```js
{
  meta: { department, term },
  days: ["Mon","Tue","Wed","Thu","Fri"],
  students: [{ id, name, roll }],
  schedules: {
    "<student id>": {
      "Mon": [{ start: "08:00", end: "08:55", code, type, room }, ...],
      ...
    }
  }
}
```

`start`/`end` are 24-hour `"HH:MM"` strings. `type` is `"Theory" | "Lab" | "Tutorial"`.

Two ways to wire in the real data:

1. **Static replace** — regenerate `data.js` with real students + schedules in the same shape
   (e.g. merging the main department sheet with the chem-sheet electives per student, per group).
2. **Real backend** — in `app.js`, replace `loadTimetable()`:

   ```js
   async function loadTimetable() {
     const res = await fetch('/api/timetable');
     return res.json();
   }
   ```

   and add a serverless function at `/api/timetable` (e.g. a Vercel API route) that reads
   from the real database and returns JSON in the shape above. If lookups are per-student
   rather than "load everyone up front," `/api/students?q=` (for the search box) and
   `/api/timetable/:studentId` are a natural split — happy to wire that up once you confirm
   how the backend will be structured.

## Note on scope

Right now every student's schedule is just the chem timetable (confirmed identical
for all 41). The CE1201/CS1201/PH1201-style main-department classes from your
screenshot aren't in here yet — send those over (with whatever distinguishes
which student gets which slot) and they can be merged in per student.