/* =========================
   BACKGROUND AUTO SWITCH
========================= */

const FOREST = "img-habit/download.png";
const MOUNTAIN = "img-habit/a6bd4db7ee7053689bd971b36cbcd1ef.jpg";
const app = document.getElementById("app");

function setBackground(){
  const hour = new Date().getHours();
  app.style.backgroundImage =
    `url("${hour >= 6 && hour < 18 ? FOREST : MOUNTAIN}")`;
}

/* =========================
   INIT
========================= */

window.onload = () => {
  setBackground();
  createParticles();
  resetDaily();
  renderAll();
  startClock();
  showDate();
};

/* =========================
   PARTICLES
========================= */

function createParticles(){
  const container = document.getElementById("particles");
  for(let i=0;i<25;i++){
    const p=document.createElement("div");
    p.className="particle";
    p.style.left=Math.random()*100+"vw";
    p.style.animationDuration=5+Math.random()*10+"s";
    container.appendChild(p);
  }
}

/* =========================
   STORAGE
========================= */

function getHabits(){
  return JSON.parse(localStorage.getItem("habits"))||[];
}
function saveHabits(data){
  localStorage.setItem("habits",JSON.stringify(data));
}

/* =========================
   DATE HELPERS
========================= */

function today(){
  return new Date().toLocaleDateString("en-CA");
}

function yesterday(){
  const d=new Date();
  d.setDate(d.getDate()-1);
  return d.toLocaleDateString("en-CA");
}

function last7Days(){
  const days=[];
  for(let i=6;i>=0;i--){
    const d=new Date();
    d.setDate(d.getDate()-i);
    days.push(d.toLocaleDateString("en-CA"));
  }
  return days;
}

/* =========================
   ADD HABIT
========================= */

document.getElementById("addBtn").onclick=()=>{
  const input=document.getElementById("habitInput");
  if(!input.value.trim()) return;

  const habits=getHabits();
  habits.push({
    text:input.value,
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
  renderAnalytics();
}

/* =========================
   RENDER HABITS
========================= */

function renderHabits(){
  const list=document.getElementById("habitList");
  const bar=document.getElementById("progress-bar");

  list.innerHTML="";
  const habits=getHabits();
  let done=0;

  habits.forEach((h,i)=>{
    if(h.completed) done++;

    const card=document.createElement("div");
    card.className="habit";

    card.innerHTML=`
      <div style="display:flex;gap:10px;align-items:center">
        <div class="checkbox ${h.completed?'done':''}">
          ${h.completed?'✓':''}
        </div>
        ${h.text}
      </div>
      <div>
        🔥 ${h.streak}
        <button onclick="deleteHabit(${i})">X</button>
      </div>
    `;

    card.querySelector(".checkbox").onclick=()=>toggle(i);
    list.appendChild(card);
  });

  bar.style.width=habits.length?
    (done/habits.length)*100+"%":"0%";
}

/* =========================
   TOGGLE
========================= */

function toggle(i){
  const habits=getHabits();
  const h=habits[i];

  if(h.completed) return;

  h.completed=true;
  h.history[today()]=true;
  h.streak=h.last===yesterday()?h.streak+1:1;
  h.last=today();

  saveHabits(habits);
  renderAll();
}

/* =========================
   DELETE
========================= */

function deleteHabit(i){
  const habits=getHabits();
  habits.splice(i,1);
  saveHabits(habits);
  renderAll();
}

/* =========================
   RESET DAILY
========================= */

function resetDaily(){
  const habits=getHabits();
  habits.forEach(h=>{
    if(h.last!==today()){
      if(h.last!==yesterday()) h.streak=0;
      h.completed=false;
    }
  });
  saveHabits(habits);
}

/* =========================
   ANALYTICS
========================= */

function renderAnalytics(){
  const statsView=document.getElementById("statsView");
  const habits=getHabits();
  const days=last7Days();

  // If no habits
  if(habits.length===0){
    statsView.innerHTML="<p style='opacity:.6'>No data yet.</p>";
    return;
  }

  let total=0;
  let best=0;

  habits.forEach(h=>{
    total+=Object.keys(h.history).length;
    if(h.streak>best) best=h.streak;
  });

  // Weekly data
  const weeklyCounts=days.map(day=>{
    let count=0;
    habits.forEach(h=>{
      if(h.history[day]) count++;
    });
    return count;
  });

  statsView.innerHTML=`
    <div class="stats-box">
      <h3>📊 Analytics</h3>
      <p>Total Habits: ${habits.length}</p>
      <p>Total Completions: ${total}</p>
      <p>Best Streak: 🔥 ${best}</p>
    </div>
    <canvas id="chart" height="140"></canvas>
  `;

  drawChart(weeklyCounts);
}

/* =========================
   DRAW WEEKLY CHART
========================= */

function drawChart(data){
  const canvas=document.getElementById("chart");
  const ctx=canvas.getContext("2d");

  const width=canvas.width;
  const height=canvas.height;
  const barWidth=width/7;

  ctx.clearRect(0,0,width,height);

  const max=Math.max(...data,1);

  data.forEach((val,i)=>{
    const barHeight=(val/max)*(height-20);
    const x=i*barWidth+10;
    const y=height-barHeight-10;

    ctx.fillStyle="#00ffaa";
    ctx.fillRect(x,y,barWidth-20,barHeight);
  });
}

/* =========================
   CLOCK + DATE
========================= */

function startClock(){
  setInterval(()=>{
    document.getElementById("clock").innerText=
      new Date().toLocaleTimeString("en-US");
  },1000);
}

function showDate(){
  document.getElementById("date").innerText=
    new Date().toLocaleDateString("en-US",{
      weekday:"long",
      month:"short",
      day:"numeric"
    });
}

/* =========================
   THEME
========================= */

const themeToggle=document.getElementById("themeToggle");

themeToggle.onclick=()=>{
  app.classList.toggle("dark");
  themeToggle.innerText=
    app.classList.contains("dark")?"☀️":"🌙";
};

/* =========================
   TABS
========================= */

const habitsTab=document.getElementById("habitsTab");
const statsTab=document.getElementById("statsTab");
const habitsView=document.getElementById("habitsView");
const statsView=document.getElementById("statsView");

habitsTab.onclick=()=>{
  habitsTab.classList.add("active");
  statsTab.classList.remove("active");
  habitsView.classList.add("active");
  statsView.classList.remove("active");
};

statsTab.onclick=()=>{
  statsTab.classList.add("active");
  habitsTab.classList.remove("active");
  statsView.classList.add("active");
  habitsView.classList.remove("active");
  renderAnalytics(); // Important fix
};
