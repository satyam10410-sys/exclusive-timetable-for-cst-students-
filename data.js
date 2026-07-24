/**
 * data.js
 * ------------------------------------------------------------------
 * Real data: all 41 CST students (from CST_ATTENDANCE_SHEET.xlsx),
 * each currently mapped to the same chemistry timetable (confirmed by
 * the user — every student has the identical Chem-sheet schedule).
 *
 * Shape expected by app.js:
 *
 * TIMETABLE_DATA = {
 *   meta: { department, term },
 *   days: ["Mon","Tue","Wed","Thu","Fri"],
 *   students: [ { id, name, roll } ],
 *   schedules: {
 *     "<student id>": {
 *       "Mon": [ { start, end, code, type, room }, ... ],
 *       ...
 *     }
 *   }
 * }
 *
 * start/end are 24h "HH:MM" strings. type is "Theory" | "Lab" | "Tutorial".
 *
 * WHEN A NON-SHARED (PER-STUDENT) TIMETABLE ARRIVES:
 * Just give each student their own entry in `schedules` instead of
 * pointing them all at SHARED_SCHEDULE below.
 *
 * WHEN A REAL BACKEND ARRIVES:
 * Point app.js's loadTimetable() at a real endpoint returning JSON in
 * this same shape instead of reading this file.
 * ------------------------------------------------------------------
 */

const SHARED_SCHEDULE = {
  Mon: [
    { start: "16:00", end: "16:55", code: "CH2104", type: "Theory", room: "R-102" },
    { start: "17:00", end: "17:55", code: "CH2103", type: "Theory", room: "R-306" }
  ],
  Tue: [
    { start: "10:00", end: "10:55", code: "CH2105", type: "Theory", room: "R-102" },
    { start: "16:00", end: "16:55", code: "CH2101", type: "Theory", room: "R-305" }
  ],
  Wed: [
    { start: "09:00", end: "09:55", code: "CH2101", type: "Tutorial", room: "R-306" },
    { start: "10:00", end: "10:55", code: "CH2101", type: "Theory", room: "R-306" },
    { start: "11:00", end: "11:55", code: "CH2102", type: "Theory", room: "R-306" },
    { start: "15:00", end: "15:55", code: "CH2104", type: "Theory", room: "R-102" },
    { start: "17:00", end: "17:55", code: "CH2105", type: "Theory", room: "R-102" }
  ],
  Thu: [
    { start: "10:00", end: "10:55", code: "CH2102", type: "Tutorial", room: "R-306" },
    { start: "11:00", end: "11:55", code: "CH2102", type: "Theory", room: "R-306" },
    { start: "15:00", end: "15:55", code: "CH2105", type: "Theory", room: "R-102" },
    { start: "17:00", end: "17:55", code: "CH2103", type: "Theory", room: "R-305" }
  ],
  Fri: [
    { start: "09:00", end: "09:55", code: "CH2103", type: "Tutorial", room: "R-305" },
    { start: "10:00", end: "11:00", code: "CH2104", type: "Lab", room: "Lab4" },
    { start: "12:00", end: "12:55", code: "CH2102", type: "Theory", room: "R-306" },
    { start: "15:00", end: "15:55", code: "CH2104", type: "Theory", room: "R-102" },
    { start: "16:00", end: "16:55", code: "CH2103", type: "Theory", room: "R-305" },
    { start: "17:00", end: "17:55", code: "CH2101", type: "Theory", room: "R-305" }
  ]
};

const STUDENTS = [
  { id: "s-2501ct01", name: "Rishikesh Yadav", roll: "2501CT01" },
  { id: "s-2501ct02", name: "Ankit Singh", roll: "2501CT02" },
  { id: "s-2501ct03", name: "Siddharth Kashyap", roll: "2501CT03" },
  { id: "s-2501ct04", name: "Ankush Raj", roll: "2501CT04" },
  { id: "s-2501ct05", name: "Ishan Srivastava", roll: "2501CT05" },
  { id: "s-2501ct06", name: "Satyam Kumar", roll: "2501CT06" },
  { id: "s-2501ct07", name: "Arihant", roll: "2501CT07" },
  { id: "s-2501ct08", name: "Kamlesh Choudhary", roll: "2501CT08" },
  { id: "s-2501ct09", name: "Guda Manaswini", roll: "2501CT09" },
  { id: "s-2501ct10", name: "Mahi Dinesh Borkar", roll: "2501CT10" },
  { id: "s-2501ct11", name: "Yajat Laad", roll: "2501CT11" },
  { id: "s-2501ct12", name: "Purusottam Mohanty", roll: "2501CT12" },
  { id: "s-2501ct13", name: "Fulara Mayank", roll: "2501CT13" },
  { id: "s-2501ct14", name: "Dhruviben Patel", roll: "2501CT14" },
  { id: "s-2501ct15", name: "Sundram Kumar", roll: "2501CT15" },
  { id: "s-2501ct16", name: "Kartik Chawla", roll: "2501CT16" },
  { id: "s-2501ct17", name: "Anshul Shailesh Kulkarni", roll: "2501CT17" },
  { id: "s-2501ct18", name: "Dhriti Singh", roll: "2501CT18" },
  { id: "s-2501ct19", name: "Charit Aggarwal", roll: "2501CT19" },
  { id: "s-2501ct20", name: "Sahil Choudhary", roll: "2501CT20" },
  { id: "s-2501ct21", name: "Manak Ram", roll: "2501CT21" },
  { id: "s-2501ct22", name: "Kesanapalli Sanjana", roll: "2501CT22" },
  { id: "s-2501ct23", name: "Aditya Amit Patil", roll: "2501CT23" },
  { id: "s-2501ct24", name: "Archit Prashant Thakur", roll: "2501CT24" },
  { id: "s-2501ct25", name: "Anmol Sharma", roll: "2501CT25" },
  { id: "s-2501ct26", name: "Yadav Rohit Sanju", roll: "2501CT26" },
  { id: "s-2501ct27", name: "Parth Shudeep Bilaye", roll: "2501CT27" },
  { id: "s-2501ct28", name: "Adarsh Kumar Gupta", roll: "2501CT28" },
  { id: "s-2501ct29", name: "Maanya Manoj Agrawal", roll: "2501CT29" },
  { id: "s-2501ct30", name: "Mitesh Tak", roll: "2501CT30" },
  { id: "s-2501ct31", name: "Dushyant Saraswat", roll: "2501CT31" },
  { id: "s-2501ct32", name: "Nilesh Mazumdar", roll: "2501CT32" },
  { id: "s-2501ct33", name: "Rakesh Reddy", roll: "2501CT33" },
  { id: "s-2501ct34", name: "Ankit Kumar Meena", roll: "2501CT34" },
  { id: "s-2501ct35", name: "Neeraj Kumar Meena", roll: "2501CT35" },
  { id: "s-2501ct36", name: "Saksham Kori", roll: "2501CT36" },
  { id: "s-2501ct37", name: "Togarwad Disha", roll: "2501CT37" },
  { id: "s-2501ct38", name: "Bhukya Archana", roll: "2501CT38" },
  { id: "s-2503ct01", name: "Esha Dildeep", roll: "2503CT01" },
  { id: "s-2503ct02", name: "Ved Pal", roll: "2503CT02" },
  { id: "s-2503ct03", name: "Rishu Kumar", roll: "2503CT03" },
];

const SCHEDULES = {};
STUDENTS.forEach(s => { SCHEDULES[s.id] = SHARED_SCHEDULE; });

const TIMETABLE_DATA = {
  meta: {
    department: "CST",
    term: "IIT Patna"
  },
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  students: STUDENTS,
  schedules: SCHEDULES
};