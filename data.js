/**
 * data.js
 * ------------------------------------------------------------------
 * Single shared timetable for CST.
 * ------------------------------------------------------------------
 */

const SHARED_SCHEDULE = {
  Mon: [
    { start: "09:00", end: "09:55", code: "CE2103", type: "Theory", room: "R-104" },
    { start: "11:00", end: "11:55", code: "CE2104", type: "Theory", room: "R-104" },
    { start: "15:00", end: "15:55", code: "CE2102", type: "Theory", room: "R-102" },
    { start: "16:00", end: "17:55", code: "CE2103", type: "Lab", room: "New Civil Workshop" }
  ],
  Tue: [
    { start: "09:00", end: "09:55", code: "CE2102", type: "Theory", room: "R-102" },
    { start: "11:00", end: "11:55", code: "CE2103", type: "Theory", room: "R-104" },
    { start: "12:00", end: "12:55", code: "CE2103", type: "Tutorial", room: "R-104" },
    { start: "15:00", end: "15:55", code: "CE2101", type: "Theory", room: "R-102" },
    { start: "16:00", end: "17:55", code: "CE2104", type: "Lab", room: "Civil Dept." }
  ],
  Wed: [
    { start: "09:00", end: "09:55", code: "CE2103", type: "Theory", room: "R-104" },
    { start: "10:00", end: "10:55", code: "CE2101", type: "Theory", room: "LT-002" },
    { start: "11:00", end: "11:55", code: "CE2104", type: "Theory", room: "R-104" }
  ],
  Thu: [
    { start: "09:00", end: "09:55", code: "CE2102", type: "Theory", room: "R-104" },
    { start: "10:00", end: "10:55", code: "CE2102", type: "Tutorial", room: "R-104" },
    { start: "11:00", end: "11:55", code: "CE2101", type: "Theory", room: "R-104" }
  ],
  Fri: [
    { start: "08:00", end: "10:55", code: "CE2101", type: "Lab", room: "Civil dept." },
    { start: "12:00", end: "12:55", code: "CE2104", type: "Theory", room: "104" }
  ]
};

window.TIMETABLE_DATA = {
  meta: {
    department: "CEE",
    term: "IIT Patna"
  },
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  schedule: SHARED_SCHEDULE 
};
