// Load habits when page opens
    window.onload = loadHabits;

    function addHabit() {
        let input = document.getElementById("habitInput");
        let habitText = input.value.trim();

        if (habitText === "") {
            alert("Please enter a habit!");
            return;
        }

        let habits = getHabits();
        habits.push({ text: habitText, completed: false });

        saveHabits(habits);
        input.value = "";
        loadHabits();
    }

    function loadHabits() {
        let list = document.getElementById("habitList");
        let count = document.getElementById("count");
        list.innerHTML = "";

        let habits = getHabits();
        count.innerText = habits.length;

        habits.forEach((habit, index) => {
            let li = document.createElement("li");

            let span = document.createElement("span");
            span.innerText = habit.text;
            if (habit.completed) span.classList.add("done");

            span.onclick = function() {
                toggleHabit(index);
            };

            let delBtn = document.createElement("button");
            delBtn.innerText = "X";
            delBtn.className = "delete";
            delBtn.onclick = function() {
                deleteHabit(index);
            };

            li.appendChild(span);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }

    function toggleHabit(index) {
        let habits = getHabits();
        habits[index].completed = !habits[index].completed;
        saveHabits(habits);
        loadHabits();
    }

    function deleteHabit(index) {
        let habits = getHabits();
        habits.splice(index, 1);
        saveHabits(habits);
        loadHabits();
    }

    function getHabits() {
        let data = localStorage.getItem("habits");
        return data ? JSON.parse(data) : [];
    }

    function saveHabits(habits) {
        localStorage.setItem("habits", JSON.stringify(habits));
    }