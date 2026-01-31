window.onload = () => {
    loadHabits();
    startClock();
    setInterval(checkReminders, 60000);
};

const input = document.getElementById("habitInput");
const timeInput = document.getElementById("habitTime");
const addBtn = document.getElementById("addBtn");

addBtn.onclick = addHabit;

function addHabit() {
    const text = input.value.trim();
    const time = timeInput.value;

    if (!text) {
        alert("Please enter a habit!");
        return;
    }

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
            const timeSpan = document.createElement("span");
            timeSpan.className = "time";
            timeSpan.innerText = `⏰ ${h.time}`;
            span.appendChild(timeSpan);
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

/* Clock */
function startClock() {
    const clock = document.getElementById("clock");
    setInterval(() => {
        const now = new Date();
        clock.innerText = now.toLocaleTimeString();
    }, 1000);
}

/* Reminder */
function checkReminders() {
    const habits = getHabits();
    const now = new Date().toTimeString().slice(0,5);

    habits.forEach(h => {
        if (h.time === now && !h.completed) {
            alert(`⏰ Reminder: ${h.text}`);
        }
    });
}

function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(h) {
    localStorage.setItem("habits", JSON.stringify(h));
}
