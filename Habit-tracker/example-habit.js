window.onload = () => {
  preloadImages();
  setAutoBackground();
  resetForNewDay();
  renderHabits();
  startClock();
  showDate();
};

/* DOM */
const app = document.getElementById("app");
const habitInput = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");

/* IMAGES */
const FOREST = "img-habit/download.png";
const MOUNTAIN = "img-habit/a6bd4db7ee7053689bd971b36cbcd1ef.jpg";

/* PRELOAD */
function preloadImages() {
  [FOREST, MOUNTAIN].forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

/* AUTO BACKGROUND BY TIME */
function setAutoBackground() {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 18) {
    app.style.backgroundImage = `url("${FOREST}")`;
  } else {
    app.style.backgroundImage = `url("${MOUNTAIN}")`;
  }
}

/* PARALLAX */
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 6;
  const y = (e.clientY / window.innerHeight - 0.5) * 6;
  app.style.transform = `translate(${x}px, ${y}px)`;
});

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
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-CA");
  });
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
  const text = document.getElementById("progress-text");

  const habits = getHabits();
  list.innerHTML = "";

  let done = 0;

  habits.forEach((h, i) => {
    if (h.completedToday) done++;

    const li = document.createElement("li");
    li.style.animationDelay = `${i * 60}ms`;

    li.innerHTML = `
      <div class="row">
        <div class="left">
          <div class="check ${h.completedToday ? "done" : ""}">${h.completedToday ? "✓" : ""}</div>
          <span class="habit ${h.completedToday ? "done" : ""}">${h.text}</span>
        </div>
        <div class="right">
          🔥 ${h.streak}
          <button class="delete">🗑</button>
        </div>
      </div>
      <div class="week">
        ${last7Days().map(d => `
          <div class="day ${h.history[d] ? "done" : ""} ${d === todayKey() ? "today" : ""}"></div>
        `).join("")}
      </div>
    `;

    li.querySelector(".check").onclick = () => toggleHabit(i);
    li.querySelector(".delete").onclick = () => deleteHabit(i);

    list.appendChild(li);
  });

  bar.style.width = habits.length ? (done / habits.length) * 100 + "%" : "0%";
  text.innerText = `${done} / ${habits.length} completed today`;
}

/* TOGGLE */
function toggleHabit(i) {
  const habits = getHabits();
  const h = habits[i];
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
function deleteHabit(i) {
  if (!confirm("Delete habit?")) return;
  const habits = getHabits();
  habits.splice(i, 1);
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
  setInterval(() => {
    document.getElementById("clock").innerText =
      new Date().toLocaleTimeString("en-US");
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
