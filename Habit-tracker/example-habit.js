window.onload = () => {
  loadTheme();
  resetForNewDay();
  renderHabits();
  startClock();
  showDate();
};

/* DOM */
const app = document.getElementById("app");
const themeToggle = document.getElementById("themeToggle");
const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");

/* THEME */
themeToggle.onclick = () => {
  app.classList.toggle("dark");
  localStorage.setItem("theme", app.classList.contains("dark") ? "dark" : "light");
  themeToggle.innerText = app.classList.contains("dark") ? "☀️" : "🌙";
};

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    app.classList.add("dark");
    themeToggle.innerText = "☀️";
  }
}

/* DATE HELPERS */
function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString("en-CA"));
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
    completedToday: false,
    streak: 0,
    lastCompleted: null,
    history: {}
  });

  saveHabits(habits);
  habitInput.value = "";
  renderHabits();
};

/* RENDER */
function renderHabits() {
  const list = document.getElementById("habitList");
  const bar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  const habits = getHabits();
  list.innerHTML = "";

  let doneCount = 0;

  habits.forEach((h, i) => {
    if (h.completedToday) doneCount++;

    const li = document.createElement("li");
    li.style.animationDelay = `${i * 60}ms`;

    const row = document.createElement("div");
    row.className = "row";

    const left = document.createElement("div");
    left.className = "left";

    const check = document.createElement("div");
    check.className = "check" + (h.completedToday ? " done" : "");
    check.innerText = h.completedToday ? "✓" : "";
    check.onclick = () => toggleHabit(i);

    const span = document.createElement("span");
    span.className = "habit" + (h.completedToday ? " done" : "");
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
    row.append(left, right);

    const week = document.createElement("div");
    week.className = "week";

    last7Days().forEach(day => {
      const dot = document.createElement("div");
      dot.className = "day";
      if (h.history[day]) dot.classList.add("done");
      if (day === todayKey()) dot.classList.add("today");
      week.appendChild(dot);
    });

    li.append(row, week);
    list.appendChild(li);
  });

  const percent = habits.length ? (doneCount / habits.length) * 100 : 0;
  bar.style.width = percent + "%";
  progressText.innerText = `${doneCount} / ${habits.length} completed today`;
}

/* TOGGLE */
function toggleHabit(index) {
  const habits = getHabits();
  const h = habits[index];
  const today = todayKey();

  if (h.completedToday) return;

  h.completedToday = true;
  h.history[today] = true;
  h.streak = h.lastCompleted === yesterdayKey() ? h.streak + 1 : 1;
  h.lastCompleted = today;

  saveHabits(habits);
  renderHabits();
}

/* DELETE */
function deleteHabit(index) {
  if (!confirm("Delete this habit?")) return;
  const habits = getHabits();
  habits.splice(index, 1);
  saveHabits(habits);
  renderHabits();
}

/* RESET */
function resetForNewDay() {
  const habits = getHabits();
  const today = todayKey();

  habits.forEach(h => {
    if (h.lastCompleted !== today) h.completedToday = false;
  });

  saveHabits(habits);
}

/* CLOCK + DATE */
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

/* STORAGE */
function getHabits() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(habits) {
  localStorage.setItem("habits", JSON.stringify(habits));
}
