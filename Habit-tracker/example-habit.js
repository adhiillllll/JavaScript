window.onload = () => {
  setBackground();
  resetDaily();
  renderHabits();
  renderCalendar();
  renderStats();
  startClock();
  showDate();
};

/* BACKGROUND */
const FOREST="img-habit/download.png";
const MOUNTAIN="img-habit/a6bd4db7ee7053689bd971b36cbcd1ef.jpg";
const app=document.getElementById("app");

function setBackground(){
  const hour=new Date().getHours();
  app.style.backgroundImage=
    `url("${hour>=6&&hour<18?FOREST:MOUNTAIN}")`;
}

/* STORAGE */
function getHabits(){
  return JSON.parse(localStorage.getItem("habits"))||[];
}
function saveHabits(h){
  localStorage.setItem("habits",JSON.stringify(h));
}

/* DATE */
function today(){
  return new Date().toLocaleDateString("en-CA");
}
function yesterday(){
  const d=new Date();
  d.setDate(d.getDate()-1);
  return d.toLocaleDateString("en-CA");
}

/* ADD */
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
  renderHabits();
  renderStats();
};

/* RENDER HABITS */
function renderHabits(){
  const list=document.getElementById("habitList");
  const bar=document.getElementById("progress-bar");
  const text=document.getElementById("progress-text");

  list.innerHTML="";
  const habits=getHabits();
  let done=0;

  habits.forEach((h,i)=>{
    if(h.completed) done++;

    const li=document.createElement("li");
    li.innerHTML=`
      <div class="row">
        <div style="display:flex;gap:10px;align-items:center">
          <div class="check ${h.completed?"done":""}">
            ${h.completed?"✓":""}
          </div>
          ${h.text}
        </div>
        <div>
          🔥 ${h.streak}
          <button class="delete">X</button>
        </div>
      </div>
    `;

    li.querySelector(".check").onclick=()=>toggle(i);
    li.querySelector(".delete").onclick=()=>removeHabit(i);

    list.appendChild(li);
  });

  bar.style.width=habits.length?
    (done/habits.length)*100+"%":"0%";
  text.innerText=`${done}/${habits.length} today`;
}

function toggle(i){
  const habits=getHabits();
  const h=habits[i];

  if(h.completed) return;

  h.completed=true;
  h.history[today()]=true;

  if(h.last===yesterday()){
    h.streak++;
  }else{
    h.streak=1;
  }

  h.last=today();

  saveHabits(habits);
  renderHabits();
  renderCalendar();
  renderStats();
}

function removeHabit(i){
  const habits=getHabits();
  habits.splice(i,1);
  saveHabits(habits);
  renderHabits();
  renderCalendar();
  renderStats();
}

/* CALENDAR */
function renderCalendar(){
  const grid=document.getElementById("calendarGrid");
  grid.innerHTML="";
  const habits=getHabits();
  const history={};

  habits.forEach(h=>{
    Object.keys(h.history).forEach(d=>{
      history[d]=true;
    });
  });

  const now=new Date();
  const days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();

  for(let d=1;d<=days;d++){
    const date=new Date(now.getFullYear(),now.getMonth(),d)
      .toLocaleDateString("en-CA");

    const cell=document.createElement("div");
    cell.className="calendar-day";
    cell.innerText=d;
    if(history[date]) cell.classList.add("done");
    grid.appendChild(cell);
  }
}

/* ANALYTICS */
function renderStats(){
  const stats=document.getElementById("statsView");
  const habits=getHabits();

  let total=0;
  let best=0;

  habits.forEach(h=>{
    total+=Object.keys(h.history).length;
    if(h.streak>best) best=h.streak;
  });

  stats.innerHTML=`
    <h3>Analytics</h3>
    <p>Total habits: ${habits.length}</p>
    <p>Total completions: ${total}</p>
    <p>Best streak: 🔥 ${best}</p>
  `;
}

/* DAILY RESET */
function resetDaily(){
  const habits=getHabits();
  habits.forEach(h=>{
    if(h.last!==today()){
      if(h.last!==yesterday()){
        h.streak=0;
      }
      h.completed=false;
    }
  });
  saveHabits(habits);
}

/* CLOCK */
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

/* SLIDER */
const slider=document.getElementById("slider");
let current=0;

function goTo(index){
  current=index;
  slider.style.transform=`translateX(-${index*100}%)`;

  document.querySelectorAll(".tabs button")
    .forEach((b,i)=>b.classList.toggle("active",i===index));
}

/* SWIPE */
let startX=0;
slider.addEventListener("touchstart",e=>{
  startX=e.touches[0].clientX;
});
slider.addEventListener("touchend",e=>{
  let diff=e.changedTouches[0].clientX-startX;
  if(diff>50 && current>0) goTo(current-1);
  if(diff<-50 && current<2) goTo(current+1);
});