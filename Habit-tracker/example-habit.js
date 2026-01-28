window.onload = loadHabits;

const input = document.getElementById("habitInput");
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", addHabit);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addHabit();
});

function addHabit() {
    const text = input.value.trim();
    if (text === "") return;

    const habits = getHabits();
    habits.push({ text, completed: false });

    saveHabits(habits);
    input.value = "";
    loadHabits();
}

function loadHabits() {
    const list = document.getElementById("habitList");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    list.innerHTML = "";
    const habits = getHabits();

    let completedCount = 0;

    habits.forEach((habit, index) => {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.innerText = habit.text;
        if (habit.completed) {
            span.classList.add("done");
            completedCount++;
        }

        span.onclick = () => toggleHabit(index);

        const delBtn = document.createElement("button");
        delBtn.innerText = "X";
        delBtn.className = "delete";
        delBtn.onclick = () => deleteHabit(index);

        li.appendChild(span);
        li.appendChild(delBtn);
        list.appendChild(li);
    });

    // Progress update
    const total = habits.length;
    const percent = total === 0 ? 0 : (completedCount / total) * 100;
    progressBar.style.width = percent + "%";
    progressText.innerText = `${completedCount} / ${total} Completed`;
}

function toggleHabit(index) {
    const habits = getHabits();
    habits[index].completed = !habits[index].completed;
    saveHabits(habits);
    loadHabits();
}

function deleteHabit(index) {
    const habits = getHabits();
    habits.splice(index, 1);
    saveHabits(habits);
    loadHabits();
}

function getHabits() {
    const data = localStorage.getItem("habits");
    return data ? JSON.parse(data) : [];
}

function saveHabits(habits) {
    localStorage.setItem("habits", JSON.stringify(habits));
}
