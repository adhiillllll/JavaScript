// ==========================
// ELEMENTS
// ==========================
const dateElement = document.getElementById("currentDate");

// Learning
const learningForm = document.getElementById("learningForm");
const topicInput = document.getElementById("topicInput");
const notesInput = document.getElementById("notesInput");
const learningList = document.getElementById("learningList");
const progressContainer = document.getElementById("progressContainer");

// Questions
const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const questionList = document.getElementById("questionList");

// ==========================
// DATA
// ==========================
let learnings = JSON.parse(localStorage.getItem("learnings")) || [];
let questions = JSON.parse(localStorage.getItem("questions")) || [];

// ==========================
// INIT
// ==========================
function init() {
  showDate();
  renderLearnings();
  renderQuestions();
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
// LEARNING SECTION
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
  saveLearnings();
  renderLearnings();
  learningForm.reset();
});

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

function deleteLearning(id) {
  learnings = learnings.filter(item => item.id !== id);
  saveLearnings();
  renderLearnings();
}

function toggleComplete(id) {
  learnings = learnings.map(item => {
    if (item.id === id) {
      return { ...item, completed: !item.completed };
    }
    return item;
  });

  saveLearnings();
  renderLearnings();
}

function updateProgress() {
  const total = learnings.length;
  const completed = learnings.filter(item => item.completed).length;

  const percentage = total === 0 ? 0 :
    Math.round((completed / total) * 100);

  progressContainer.innerHTML = `
    <p>${completed} / ${total} Completed</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${percentage}%"></div>
    </div>
    <p>${percentage}% Progress</p>
  `;
}

function saveLearnings() {
  localStorage.setItem("learnings", JSON.stringify(learnings));
}

// ==========================
// QUESTION SECTION
// ==========================
questionForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const newQuestion = {
    id: Date.now(),
    question: questionInput.value,
    answer: answerInput.value,
    revised: false
  };

  questions.push(newQuestion);
  saveQuestions();
  renderQuestions();
  questionForm.reset();
});

function renderQuestions() {
  questionList.innerHTML = "";

  questions.forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="question-item">
        <input type="checkbox"
          ${item.revised ? "checked" : ""}
          onclick="toggleRevised(${item.id})" />

        <div>
          <strong class="${item.revised ? "revised-text" : ""}">
            ${item.question}
          </strong>
          <p>${item.answer}</p>
        </div>

        <button onclick="deleteQuestion(${item.id})">Delete</button>
      </div>
    `;

    questionList.appendChild(li);
  });
}

function toggleRevised(id) {
  questions = questions.map(item => {
    if (item.id === id) {
      return { ...item, revised: !item.revised };
    }
    return item;
  });

  saveQuestions();
  renderQuestions();
}

function deleteQuestion(id) {
  questions = questions.filter(item => item.id !== id);
  saveQuestions();
  renderQuestions();
}

function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}
