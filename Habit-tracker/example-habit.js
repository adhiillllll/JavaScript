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

/* ================= THEME ================= */
themeToggle.onclick = () => {
  app.classList.toggle("dark");
  const dark = app.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeToggle.innerText = dark ? "☀️" : "🌙";
};

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    app.classList.add("dark");
    themeToggle.innerText = "☀️";
  }
}

/* ================= DATE UTILS ================= */
function today() {
  return new Date().toISOString().slice(0, 10);
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/* ================= ADD HABIT ================= */
addBtn.onclick = () => {
  const text = habitInput.value.trim();
  if (!text) return;

  const habits = getHabits();
  habits.push({
    text,
    streak: 0,
    lastDone: null,
    doneToday: false
  });

  saveHabits(habits);
  habitInput.value = "";
  loadHabits();
};

/* ================= LOAD ================= */
function loadHabits() {
  const list = document.getElementById("habitList");
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");

  list.innerHTML = "";
  const habits = getHabits();
  let done = 0;

  habits.forEach((h, i) => {
    if (h.doneToday) done++;

    const li = document.createElement("li");

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

    const streak = document.createElement("span");
    streak.className = "streak";
    streak.innerText = `🔥 ${h.streak}`;

    li.append(left, streak);
    list.appendChild(li);
  });

  bar.style.width = habits.length ? (done / habits.length) * 100 + "%" : "0%";
  text.innerText = `${done} / ${habits.length} completed today`;
}

/* ================= TOGGLE ================= */
function toggleHabit(i) {
  const habits = getHabits();
  const h = habits[i];

  if (!h.doneToday) {
    h.streak = h.lastDone === yesterday() ? h.streak + 1 : 1;
    h.lastDone = today();
    h.doneToday = true;
  }

  saveHabits(habits);
  loadHabits();
}

/* ================= DAILY RESET ================= */
function resetIfNewDay() {
  const habits = getHabits();
  const t = today();

  habits.forEach(h => {
    if (h.lastDone !== t) h.doneToday = false;
  });

  saveHabits(habits);
}

/* ================= CLOCK ================= */
function startClock() {
  const c = document.getElementById("clock");
  setInterval(() => {
    c.innerText = new Date().toLocaleTimeString("en-US");
  }, 1000);
}

/* ================= STORAGE ================= */
function getHabits() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(h) {
  localStorage.setItem("habits", JSON.stringify(h));
}
