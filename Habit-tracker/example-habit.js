/* ========== INIT ========== */
window.onload = () => {
  loadTheme();
  handleNewDay();
  renderHabits();
  startClock();
  showDate();
};

/* ========== DOM ========== */
const app = document.getElementById("app");
const themeToggle = document.getElementById("themeToggle");
const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");

/* ========== THEME ========== */
themeToggle.onclick = () => {
  const isDark = app.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerText = isDark ? "☀️" : "🌙";
};

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    app.classList.add("dark");
    themeToggle.innerText = "☀️";
  }
}

/* ========== DATE HELPERS ========== */
function getTodayKey() {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString("en-CA"));
  }
  return days;
}

/* ========== ADD HABIT ========== */
addBtn.onclick = () => {
  const text = habitInput.value.trim();
  if (!text) return;

  const habits = getHabits();
  habits.push({
    text,
    completedToday: false,
    streak: 0,
    lastCompleted: null,
    history: {}
  });

  saveHabits(habits);
  habitInput.value = "";
  renderHabits();
};

/* ========== RENDER ========== */
function renderHabits() {
  const list = document.getElementById("habitList");
  const bar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  const habits = getHabits();
  list.innerHTML = "";

  let completedCount = 0;

  habits.forEach((habit, index) => {
    if (habit.completedToday) completedCount++;

    const li = document.createElement("li");
    li.style.animationDelay = `${index * 60}ms`;

    const row = document.createElement("div");
    row.className = "row";

    const left = document.createElement("div");
    left.className = "left";

    const check = document.createElement("div");
    check.className = "check" + (habit.completedToday ? " done" : "");
    check.innerText = habit.completedToday ? "✓" : "";
    check.onclick = () => toggleHabit(index);

    const title = document.createElement("span");
    title.className = "habit" + (habit.completedToday ? " done" : "");
    title.innerText = habit.text;

    left.append(check, title);

    const right = document.createElement("div");
    right.className = "right";

    const streak = document.createElement("span");
    streak.className = "streak";
    streak.innerText = `🔥 ${habit.streak}`;

    const del = document.createElement("button");
    del.className = "delete";
    del.innerText = "🗑";
    del.onclick = () => deleteHabit(index);

    right.append(streak, del);
    row.append(left, right);

    const week = document.createElement("div");
    week.className = "week";

    getLast7Days().forEach(day => {
      const dot = document.createElement("div");
      dot.className = "day";
      if (habit.history[day]) dot.classList.add("done");
      if (day === getTodayKey()) dot.classList.add("today");
      week.appendChild(dot);
    });

    li.append(row, week);
    list.appendChild(li);
  });

  const percent = habits.length
    ? (completedCount / habits.length) * 100
    : 0;

  bar.style.width = percent + "%";
  progressText.innerText = `${completedCount} / ${habits.length} completed today`;
}

/* ========== TOGGLE ========== */
function toggleHabit(index) {
  const habits = getHabits();
  const habit = habits[index];
  const today = getTodayKey();

  if (habit.completedToday) return;

  habit.completedToday = true;
  habit.history[today] = true;

  if (habit.lastCompleted === getYesterdayKey()) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }

  habit.lastCompleted = today;

  saveHabits(habits);
  renderHabits();
}

/* ========== DELETE ========== */
function deleteHabit(index) {
  if (!confirm("Delete this habit?")) return;
  const habits = getHabits();
  habits.splice(index, 1);
  saveHabits(habits);
  renderHabits();
}

/* ========== NEW DAY RESET ========== */
function handleNewDay() {
  const habits = getHabits();
  const today = getTodayKey();

  habits.forEach(h => {
    if (h.lastCompleted !== today) {
      h.completedToday = false;
    }
  });

  saveHabits(habits);
}

/* ========== CLOCK & DATE ========== */
function startClock() {
  const clock = document.getElementById("clock");
  setInterval(() => {
    clock.innerText = new Date().toLocaleTimeString("en-US");
  }, 1000);
}

function showDate() {
  document.getElementById("date").innerText =
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
}

/* ========== STORAGE ========== */
function getHabits() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(habits) {
  localStorage.setItem("habits", JSON.stringify(habits));
}
