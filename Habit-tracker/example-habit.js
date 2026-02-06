window.onload = () => {
  loadTheme();
  resetIfNewDay();
  loadHabits();
  startClock();
};

/* DOM */
const app = document.getElementById("app");
const themeToggle = document.getElementById("themeToggle");
const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");

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

/* DATE HELPERS */
const today = () => new Date().toISOString().slice(0, 10);

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

/* ADD */
addBtn.onclick = () => {
  const text = habitInput.value.trim();
  if (!text) return;

  const habits = getHabits();
  habits.push({
    text,
    doneToday: false,
    streak: 0,
    lastDone: null,
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
  let doneCount = 0;

  habits.forEach((h, i) => {
    if (h.doneToday) doneCount++;

    const li = document.createElement("li");
    li.style.animationDelay = `${i * 60}ms`; // 🌊 waterfall

    const row = document.createElement("div");
    row.className = "row";

    const left = document.createElement("div");
    left.className = "left";

    const check = document.createElement("div");
    check.className = "check" + (h.doneToday ? " done" : "");
    check.innerText = h.doneToday ? "✓" : "";
    check.onclick = () => toggleHabit(i);

    const span = document.createElement("span");
    span.className = "habit" + (h.doneToday ? " done" : "");
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

    for (let d = 6; d >= 0; d--) {
      const date = daysAgo(d);
      const dot = document.createElement("div");
      dot.className = "day";
      if (h.history[date]) dot.classList.add("done");
      if (date === today()) dot.classList.add("today");
      week.appendChild(dot);
    }

    li.append(row, week);
    list.appendChild(li);
  });

  bar.style.width = habits.length ? (doneCount / habits.length) * 100 + "%" : "0%";
  text.innerText = `${doneCount} / ${habits.length} completed today`;
}

/* TOGGLE */
function toggleHabit(index) {
  const habits = getHabits();
  const h = habits[index];
  const t = today();

  if (!h.doneToday) {
    h.doneToday = true;
    h.history[t] = true;
    h.streak = h.lastDone === daysAgo(1) ? h.streak + 1 : 1;
    h.lastDone = t;
  }

  saveHabits(habits);
  loadHabits();
}

/* DELETE */
function deleteHabit(index) {
  if (!confirm("Delete this habit?")) return;
  const habits = getHabits();
  habits.splice(index, 1);
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
  const clock = document.getElementById("clock");
  setInterval(() => {
    clock.innerText = new Date().toLocaleTimeString("en-US");
  }, 1000);
}

/* STORAGE */
function getHabits() {
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(habits) {
  localStorage.setItem("habits", JSON.stringify(habits));
}
