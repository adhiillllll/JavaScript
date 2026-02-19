/* =========================
   AUTO BACKGROUND
========================= */

const FOREST = "img-habit/download.png";
const MOUNTAIN = "img-habit/a6bd4db7ee7053689bd971b36cbcd1ef.jpg";

function setBackground(){
  const hour = new Date().getHours();
  const app = document.getElementById("app");
  app.style.backgroundImage =
    `url("${hour >= 6 && hour < 18 ? FOREST : MOUNTAIN}")`;
}

/* =========================
   ON LOAD
========================= */

window.onload = () => {
  setBackground();
  resetDaily();
  renderAll();
  startClock();
  showDate();
};

/* =========================
   STORAGE
========================= */

function getHabits(){
  return JSON.parse(localStorage.getItem("habits")) || [];
}

function saveHabits(data){
  localStorage.setItem("habits", JSON.stringify(data));
}

/* =========================
   DATE HELPERS
========================= */

function today(){
  return new Date().toLocaleDateString("en-CA");
}

function yesterday(){
  const d = new Date();
  d.setDate(d.getDate()-1);
  return d.toLocaleDateString("en-CA");
}

/* =========================
   ADD HABIT
========================= */

document.getElementById("addBtn").onclick = () => {
  const input = document.getElementById("habitInput");
  if(!input.value.trim()) return;

  const habits = getHabits();

  habits.push({
    text: input.value,
    completed:false,
    streak:0,
    last:null,
    history:{}
  });

  saveHabits(habits);
  input.value="";
  renderAll();
};

/* =========================
   RENDER ALL
========================= */

function renderAll(){
  renderHabits();
  renderStats();
}

/* =========================
   RENDER HABITS
========================= */

function renderHabits(){
  const list = document.getElementById("habitList");
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");

  list.innerHTML="";
  const habits = getHabits();
  let done=0;

  habits.forEach((h,i)=>{
    if(h.completed) done++;

    const card = document.createElement("div");
    card.className="habit";

    card.innerHTML = `
      <div class="left">
        <div class="checkbox ${h.completed?'done':''}">
          ${h.completed?'✓':''}
        </div>
        <div class="habit-name ${h.completed?'done':''}">
          ${h.text}
        </div>
      </div>
      <div class="right">
        <div class="streak">🔥 ${h.streak}</div>
        <button class="delete">X</button>
      </div>
    `;

    card.querySelector(".checkbox").onclick = ()=>toggle(i);
    card.querySelector(".delete").onclick = ()=>removeHabit(i);

    list.appendChild(card);
  });

  bar.style.width = habits.length
    ? (done/habits.length  )*100 + "%"
    : "0%";

  text.innerText = `${done}/${habits.length} completed today`;
}

/* =========================
   TOGGLE HABIT
========================= */

function toggle(i){
  const habits = getHabits();
  const h = habits[i];

  if(h.completed) return;

  h.completed = true;
  h.history[today()] = true;
  h.streak = h.last === yesterday() ? h.streak+1 : 1;
  h.last = today();

  saveHabits(habits);
  renderAll();
}

/* =========================
   DELETE
========================= */

function removeHabit(i){
  const habits = getHabits();
  habits.splice(i,1);
  saveHabits(habits);
  renderAll();
}

/* =========================
   DAILY RESET
========================= */

function resetDaily(){
  const habits = getHabits();

  habits.forEach(h=>{
    if(h.last !== today()){
      if(h.last !== yesterday()) h.streak=0;
      h.completed=false;
    }
  });

  saveHabits(habits);
}

/* =========================
   STATS
========================= */

function renderStats(){
  const stats = document.getElementById("statsContent");
  const habits = getHabits();

  let total=0;
  let best=0;

  habits.forEach(h=>{
    total += Object.keys(h.history).length;
    if(h.streak > best) best = h.streak;
  });

  stats.innerHTML = `
    <div class="stats-box">
      <h3>📊 Analytics</h3>
      <p>Total Habits: ${habits.length}</p>
      <p>Total Completions: ${total}</p>
      <p>Best Streak: 🔥 ${best}</p>
    </div>
  `;
}

/* =========================
   CLOCK
========================= */

function startClock(){
  setInterval(()=>{
    document.getElementById("clock").innerText =
      new Date().toLocaleTimeString("en-US");
  },1000);
}

function showDate(){
  document.getElementById("date").innerText =
    new Date().toLocaleDateString("en-US",{
      weekday:"long",
      month:"short",
      day:"numeric"
    });
}

/* =========================
   TABS
========================= */

const habitsTab = document.getElementById("habitsTab");
const statsTab = document.getElementById("statsTab");
const habitsView = document.getElementById("habitsView");
const statsView = document.getElementById("statsView");

habitsTab.onclick = ()=>switchTab("habits");
statsTab.onclick = ()=>switchTab("stats");

function switchTab(tab){
  document.querySelectorAll(".tabs button")
    .forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".view")
    .forEach(v=>v.classList.remove("active"));

  if(tab==="habits"){
    habitsTab.classList.add("active");
    habitsView.classList.add("active");
  }else{
    statsTab.classList.add("active");
    statsView.classList.add("active");
  }
}
