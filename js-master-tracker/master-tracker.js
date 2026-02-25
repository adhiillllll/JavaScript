// ==========================
// ELEMENTS
// ==========================
const dateElement = document.getElementById("currentDate");
const learningForm = document.getElementById("learningForm");
const topicInput = document.getElementById("topicInput");
const notesInput = document.getElementById("notesInput");
const learningList = document.getElementById("learningList");

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
// RENDER FUNCTION
// ==========================
function renderLearnings() {
  learningList.innerHTML = "";

  learnings.forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.topic}</strong><br/>
      <small>${item.date}</small><br/>
      <p>${item.notes}</p>
      <button onclick="deleteLearning(${item.id})">Delete</button>
    `;

    learningList.appendChild(li);
  });
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
    date: new Date().toDateString()
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
// STORAGE
// ==========================
function saveToStorage() {
  localStorage.setItem("learnings", JSON.stringify(learnings));
}
