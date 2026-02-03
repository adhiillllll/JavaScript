window.onload = () => {
  loadTheme();
  resetIfNewDay();
  loadHabits();
  startClock();
};

const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");
const app = document.getElementById("app");
const themeToggle = document.getElementById("themeToggle");

/* THEME */
themeToggle.onclick = () => {
  app.classList.toggle("dark");
  const dark = app.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeToggle.innerText = dark ? "☀️" : "🌙";
};

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    app.classList.add("dark");
    themeToggle.innerText = "☀️";
  }
}

/* DATE UTILS */
const today = () => new Date().toISOString().slice(0,10);

function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0,10));
  }
  return days;
}

/* ADD */
addBtn.onclick = () => {
  const text = habitInput.value.trim();
  if (!text) return;

  const habits = getHabits();
  habits.push({
    text,
    streak: 0,
    lastDone: null,
    doneToday: false,
    history: {}
  });

  saveHabits(habits);
  habitInput.value = "";
  loadHabits();
};

/* LOAD */
function loadHabits() {
  const list = document.getElementById("habitList");
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");

  list.innerHTML = "";
  const habits = getHabits();
  let done = 0;

  habits.forEach((h,i)=>{
    if (h.doneToday) done++;

    const li = document.createElement("li");

    /* TOP */
    const top = document.createElement("div");
    top.className = "top";

    const left = document.createElement("div");
    left.className = "left";

    const check = document.createElement("div");
    check.className = "check" + (h.doneToday ? " done" : "");
    check.innerText = h.doneToday ? "✓" : "";
    check.onclick = () => toggleHabit(i);

    const span = document.createElement("span");
    span.className = "habit-text" + (h.doneToday ? " done" : "");
    span.innerText = h.text;

    left.append(check, span);

    const right = document.createElement("div");
    right.className = "right";

    const streak = document.createElement("span");
    streak.className = "streak";
    streak.innerText = `🔥 ${h.streak}`;

    const del = document.createElement("button");
    del.className = "delete";
    del.innerText = "🗑";
    del.onclick = () => deleteHabit(i);

    right.append(streak, del);
    top.append(left, right);

    /* WEEK */
    const week = document.createElement("div");
    week.className = "week";

    last7Days().forEach(d=>{
      const dot = document.createElement("div");
      dot.className = "day";
      if (h.history[d]) dot.classList.add("done");
      if (d === today()) dot.classList.add("today");
      week.appendChild(dot);
    });

    li.append(top, week);
    list.appendChild(li);
  });

  bar.style.width = habits.length ? (done/habits.length)*100 + "%" : "0%";
  text.innerText = `${done} / ${habits.length} completed today`;
}

/* TOGGLE */
function toggleHabit(i) {
  const habits = getHabits();
  const h = habits[i];
  const t = today();

  if (!h.doneToday) {
    h.doneToday = true;
    h.history[t] = true;
    h.streak = h.history[todayMinus(1)] ? h.streak + 1 : 1;
    h.lastDone = t;
  }

  saveHabits(habits);
  loadHabits();
}

function todayMinus(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0,10);
}

/* DELETE */
function deleteHabit(i) {
  if (!confirm("Delete this habit?")) return;
  const habits = getHabits();
  habits.splice(i,1);
  saveHabits(habits);
  loadHabits();
}

/* RESET */
function resetIfNewDay() {
  const habits = getHabits();
  const t = today();
  habits.forEach(h => {
    if (h.lastDone !== t) h.doneToday = false;
  });
  saveHabits(habits);
}

/* CLOCK */
function startClock() {
  const c = document.getElementById("clock");
  setInterval(() => {
    c.innerText = new Date().toLocaleTimeString("en-US");
  }, 1000);
}

/* STORAGE */
const getHabits = () =>
  JSON.parse(localStorage.getItem("habits")) || [];

const saveHabits = h =>
  localStorage.setItem("habits", JSON.stringify(h));
