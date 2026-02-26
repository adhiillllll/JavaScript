// ==========================
// ELEMENTS
// ==========================
const dateElement = document.getElementById("currentDate");
const learningForm = document.getElementById("learningForm");
const topicInput = document.getElementById("topicInput");
const notesInput = document.getElementById("notesInput");
const learningList = document.getElementById("learningList");
const progressContainer = document.getElementById("progressContainer");

// ==========================
// DATA
// ==========================
let learnings = JSON.parse(localStorage.getItem("learnings")) || [];

// ==========================
// INIT
// ==========================
function init() {
  showDate();
  renderLearnings();
}

init();

// ==========================
// DATE
// ==========================
function showDate() {
  const today = new Date();
  dateElement.textContent = today.toDateString();
}

// ==========================
// RENDER
// ==========================
function renderLearnings() {
  learningList.innerHTML = "";

  learnings.forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="learning-item">
        <input type="checkbox"
          ${item.completed ? "checked" : ""}
          onclick="toggleComplete(${item.id})" />

        <div>
          <strong style="${item.completed ? "text-decoration: line-through;" : ""}">
            ${item.topic}
          </strong>
          <br/>
          <small>${item.date}</small>
          <p>${item.notes}</p>
        </div>

        <button onclick="deleteLearning(${item.id})">Delete</button>
      </div>
    `;

    learningList.appendChild(li);
  });

  updateProgress();
}

// ==========================
// ADD LEARNING
// ==========================
learningForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const newLearning = {
    id: Date.now(),
    topic: topicInput.value,
    notes: notesInput.value,
    date: new Date().toDateString(),
    completed: false
  };

  learnings.push(newLearning);
  saveToStorage();
  renderLearnings();

  learningForm.reset();
});

// ==========================
// DELETE
// ==========================
function deleteLearning(id) {
  learnings = learnings.filter(item => item.id !== id);
  saveToStorage();
  renderLearnings();
}

// ==========================
// TOGGLE COMPLETE
// ==========================
function toggleComplete(id) {
  learnings = learnings.map(item => {
    if (item.id === id) {
      return { ...item, completed: !item.completed };
    }
    return item;
  });

  saveToStorage();
  renderLearnings();
}

// ==========================
// PROGRESS
// ==========================
function updateProgress() {
  const total = learnings.length;
  const completed = learnings.filter(item => item.completed).length;

  const percentage = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  progressContainer.innerHTML = `
    <p>${completed} / ${total} Completed</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${percentage}%"></div>
    </div>
    <p>${percentage}% Progress</p>
  `;
}

// ==========================
// STORAGE
// ==========================
function saveToStorage() {
  localStorage.setItem("learnings", JSON.stringify(learnings));
}