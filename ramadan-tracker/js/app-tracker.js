// ---------- CLOCK ----------
function startClock(){
    const clock = document.getElementById("clock");
    if(!clock) return;

    setInterval(() => {
        const now = new Date();
        clock.innerText = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    },1000);
}
startClock();

// ---------- DEFAULT HABITS ----------
const defaultHabits = [
  "Fajr Prayer",
  "Dhuha Prayer",
  "Dhuhr Prayer",
  "Asr Prayer",
  "Maghrib Prayer",
  "Isha Prayer"
];

// ---------- STORAGE ----------
function getHabits(){
    let data = localStorage.getItem("ramabit-habits");
    if(!data){
        let prepared = defaultHabits.map(h => ({text:h, done:false}));
        localStorage.setItem("ramabit-habits", JSON.stringify(prepared));
        return prepared;
    }
    return JSON.parse(data);
}

function saveHabits(habits){
    localStorage.setItem("ramabit-habits", JSON.stringify(habits));
}

// ---------- LOAD HOME ----------
function loadHome(){
    const list = document.getElementById("habitList");
    if(!list) return;

    let habits = getHabits();
    list.innerHTML = "";
    let doneCount = 0;

    habits.forEach((h, index) => {
        const div = document.createElement("div");
        div.className = "habit-item";

        const title = document.createElement("span");
        title.innerText = h.text;

        const check = document.createElement("div");
        check.className = "check";
        if(h.done){
            check.classList.add("done");
            doneCount++;
        }

        check.onclick = () => toggleHabit(index);

        div.appendChild(title);
        div.appendChild(check);
        list.appendChild(div);
    });

    // Progress Circle
    const percent = Math.round((doneCount / habits.length) * 100);
    const circle = document.getElementById("progressCircle");
    if(circle) circle.innerText = percent + "%";
}

// ---------- LOAD ROUTINE ----------
function loadRoutine(){
    const list = document.getElementById("routineList");
    if(!list) return;

    let habits = getHabits();
    list.innerHTML = "";

    habits.forEach((h, index) => {
        const div = document.createElement("div");
        div.className = "habit-item";

        const title = document.createElement("span");
        title.innerText = h.text;

        const check = document.createElement("div");
        check.className = "check";
        if(h.done) check.classList.add("done");

        check.onclick = () => toggleHabit(index);

        div.appendChild(title);
        div.appendChild(check);
        list.appendChild(div);
    });
}

// ---------- TOGGLE ----------
function toggleHabit(index){
    let habits = getHabits();
    habits[index].done = !habits[index].done;
    saveHabits(habits);
    loadHome();
    loadRoutine();
}

// ---------- REMINDER / ALARM ----------
function openReminder(){
    const time = prompt("Set reminder time (HH:MM format)", "18:30");
    if(!time) return;
    setReminder(time);
    alert("Reminder set for " + time);
}

function setReminder(timeString){
    const now = new Date();
    const target = new Date();
    const [hour,minute] = timeString.split(":");
    target.setHours(hour);
    target.setMinutes(minute);
    target.setSeconds(0);

    let delay = target.getTime() - now.getTime();
    if(delay < 0) delay += 24*60*60*1000;

    setTimeout(() => {
        alert("⏰ Ramabit Reminder: Time for your prayer!");
    }, delay);
}

// ---------- INIT ----------
loadHome();
loadRoutine();
