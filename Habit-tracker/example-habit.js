window.onload = () => {
  preload();
  autoBackground();
  renderHabits();
  renderCalendar();
  startClock();
  showDate();
};

/* Images */
const FOREST = "img-habit/download.png";
const MOUNTAIN = "img-habit/a6bd4db7ee7053689bd971b36cbcd1ef.jpg";
const app = document.getElementById("app");

function preload(){
  [FOREST,MOUNTAIN].forEach(src=>{
    const img=new Image();
    img.src=src;
  });
}

function autoBackground(){
  const hour=new Date().getHours();
  app.style.backgroundImage=
    `url("${hour>=6 && hour<18?FOREST:MOUNTAIN}")`;
}

/* Date */
function todayKey(){
  return new Date().toLocaleDateString("en-CA");
}
function yesterdayKey(){
  const d=new Date();
  d.setDate(d.getDate()-1);
  return d.toLocaleDateString("en-CA");
}

/* Storage */
function getHabits(){
  return JSON.parse(localStorage.getItem("habits"))||[];
}
function saveHabits(h){
  localStorage.setItem("habits",JSON.stringify(h));
}

/* Add */
document.getElementById("addBtn").onclick=()=>{
  const input=document.getElementById("habitInput");
  if(!input.value.trim()) return;
  const habits=getHabits();
  habits.push({
    text:input.value,
    completedToday:false,
    streak:0,
    lastCompleted:null,
    history:{}
  });
  saveHabits(habits);
  input.value="";
  renderHabits();
  renderCalendar();
};

/* Render Habits */
function renderHabits(){
  const list=document.getElementById("habitList");
  const bar=document.getElementById("progress-bar");
  const text=document.getElementById("progress-text");
  list.innerHTML="";
  const habits=getHabits();
  let done=0;

  habits.forEach((h,i)=>{
    if(h.completedToday) done++;
    const li=document.createElement("li");
    li.innerHTML=`
      <div class="row">
        <div style="display:flex;gap:10px;align-items:center">
          <div class="check ${h.completedToday?"done":""}">
            ${h.completedToday?"✓":""}
          </div>
          <span class="habit ${h.completedToday?"done":""}">
            ${h.text}
          </span>
        </div>
        🔥 ${h.streak}
      </div>
      <div class="week"></div>
    `;

    li.querySelector(".check").onclick=()=>toggleHabit(i);

    list.appendChild(li);
  });

  bar.style.width=habits.length?
    (done/habits.length)*100+"%":"0%";
  text.innerText=`${done}/${habits.length} today`;
}

/* Toggle */
function toggleHabit(i){
  const habits=getHabits();
  const h=habits[i];
  if(h.completedToday) return;

  h.completedToday=true;
  h.history[todayKey()]=true;
  h.streak=
    h.lastCompleted===yesterdayKey()?
    h.streak+1:1;
  h.lastCompleted=todayKey();

  saveHabits(habits);
  renderHabits();
  renderCalendar();

  if([7,30,100].includes(h.streak)){
    fireBurst();
  }
}

/* Calendar */
function renderCalendar(){
  const grid=document.getElementById("calendarGrid");
  grid.innerHTML="";
  const habits=getHabits();
  const allHistory={};

  habits.forEach(h=>{
    Object.keys(h.history).forEach(d=>{
      allHistory[d]=true;
    });
  });

  const now=new Date();
  const days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();

  for(let d=1; d<=days; d++){
    const date=new Date(now.getFullYear(),now.getMonth(),d)
      .toLocaleDateString("en-CA");

    const cell=document.createElement("div");
    cell.className="calendar-day";
    cell.innerText=d;
    if(allHistory[date]) cell.classList.add("done");
    grid.appendChild(cell);
  }
}

/* Fire animation */
function fireBurst(){
  const fire=document.createElement("div");
  fire.className="fire-burst";
  fire.innerText="🔥";
  fire.style.top="40%";
  fire.style.left="40%";
  app.appendChild(fire);
  setTimeout(()=>fire.remove(),1000);
}

/* Clock & Date */
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

/* Tabs */
document.querySelectorAll(".tabs button").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".tabs button")
      .forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".view")
      .forEach(v=>v.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab+"View")
      .classList.add("active");
  };
});
