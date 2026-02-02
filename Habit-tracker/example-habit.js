window.onload = () => {
    loadHabits();
    startClock();
    loadTheme();
    requestNotificationPermission();
    setInterval(checkReminders, 60000);
};

const input = document.getElementById("habitInput");
const timeInput = document.getElementById("habitTime");
const addBtn = document.getElementById("addBtn");
const app = document.getElementById("app");
const toggleBtn = document.getElementById("themeToggle");

/* ================= THEME ================= */
toggleBtn.onclick = () => {
    app.classList.toggle("dark");
    const isDark = app.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleBtn.innerText = isDark ? "☀️" : "🌙";
};

function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        app.classList.add("dark");
        toggleBtn.innerText = "☀️";
    }
}

/* ================= HABITS ================= */
addBtn.onclick = addHabit;

function addHabit() {
    const text = input.value.trim();
    const time = timeInput.value;

    if (!text) return;

    const habits = getHabits();
    habits.push({ text, completed: false, time });

    saveHabits(habits);
    input.value = "";
    timeInput.value = "";
    loadHabits();
}

function loadHabits() {
    const list = document.getElementById("habitList");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    list.innerHTML = "";
    const habits = getHabits();
    let completed = 0;

    habits.forEach((h, i) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.innerText = h.text;
        if (h.completed) {
            span.classList.add("done");
            completed++;
        }
        span.onclick = () => toggleHabit(i);

        if (h.time) {
            const t = document.createElement("span");
            t.className = "time";
            t.innerText = `⏰ ${h.time}`;
            span.appendChild(t);
        }

        const del = document.createElement("button");
        del.innerText = "X";
        del.className = "delete";
        del.onclick = () => deleteHabit(i);

        li.append(span, del);
        list.appendChild(li);
    });

    const percent = habits.length ? (completed / habits.length) * 100 : 0;
    progressBar.style.width = percent + "%";
    progressText.innerText = `${completed} / ${habits.length} Completed`;
}

function toggleHabit(i) {
    const habits = getHabits();
    habits[i].completed = !habits[i].completed;
    saveHabits(habits);
    loadHabits();
}

function deleteHabit(i) {
    const habits = getHabits();
    habits.splice(i, 1);
    saveHabits(habits);
    loadHabits();
}

/* ================= CLOCK ================= */
function startClock() {
    const clock = document.getElementById("clock");
    setInterval(() => {
        clock.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

/* ================= NOTIFICATIONS ================= */
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function checkReminders() {
    if (Notification.permission !== "granted") return;

    const now = new Date().toTimeString().slice(0, 5);
    const habits = getHabits();

    habits.forEach(h => {
        if (h.time === now && !h.completed) {
            new Notification("Habit Reminder 🌱", {
                body: h.text,
                icon: "img-habit/download.png"
            });
        }
    });
}

/* ================= STORAGE ================= */
function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(h) {
    localStorage.setItem("habits", JSON.stringify(h));
}
