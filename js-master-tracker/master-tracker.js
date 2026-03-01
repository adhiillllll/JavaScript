// ==========================
// ELEMENTS
// ==========================
const dateElement = document.getElementById("currentDate");
const streakElement = document.getElementById("streakCount");

const learningForm = document.getElementById("learningForm");
const topicInput = document.getElementById("topicInput");
const notesInput = document.getElementById("notesInput");
const learningList = document.getElementById("learningList");
const progressContainer = document.getElementById("progressContainer");

const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const questionList = document.getElementById("questionList");

// ==========================
// DATA
// ==========================
let learnings = JSON.parse(localStorage.getItem("learnings")) || [];
let questions = JSON.parse(localStorage.getItem("questions")) || [];

let streakData = JSON.parse(localStorage.getItem("streakData")) || {
  count: 0,
  lastDate: null
};

// ==========================
// INIT
// ==========================
function init() {
  showDate();
  renderLearnings();
  renderQuestions();
  updateStreakUI();
}

init();

// ==========================
// DATE
// ==========================
function showDate() {
  dateElement.textContent = new Date().toDateString();
}

// ==========================
// STREAK
// ==========================
function updateStreak() {
  const today = new Date().toDateString();

  if (streakData.lastDate === today) return;

  if (!streakData.lastDate) {
    streakData.count = 1;
  } else {
    const last = new Date(streakData.lastDate);
    const now = new Date(today);
    const diffDays = (now - last) / (1000 * 60 * 60 * 24);

    streakData.count = diffDays === 1 ? streakData.count + 1 : 1;
  }

  streakData.lastDate = today;
  localStorage.setItem("streakData", JSON.stringify(streakData));
  updateStreakUI();
}

function updateStreakUI() {
  streakElement.textContent = streakData.count;
}

// ==========================
// LEARNING
// ==========================
learningForm.addEventListener("submit", (e) => {
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
  updateStreak();
});

function renderLearnings() {
  learningList.innerHTML = "";

  learnings.forEach(item => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="learning-item" data-id="${item.id}">
        <input type="checkbox" ${item.completed ? "checked" : ""} class="toggle-complete"/>
        <div>
          <strong class="${item.completed ? "revised-text" : ""}">
            ${item.topic}
          </strong>
          <br/>
          <small>${item.date}</small>
          <p>${item.notes}</p>
        </div>
        <button class="delete-learning">Delete</button>
      </div>
    `;

    learningList.appendChild(li);
  });

  updateProgress();
}

// Event Delegation
learningList.addEventListener("click", (e) => {
  const parent = e.target.closest(".learning-item");
  if (!parent) return;

  const id = Number(parent.dataset.id);

  if (e.target.classList.contains("delete-learning")) {
    learnings = learnings.filter(item => item.id !== id);
  }

  if (e.target.classList.contains("toggle-complete")) {
    learnings = learnings.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
  }

  saveLearnings();
  renderLearnings();
});

function updateProgress() {
  const total = learnings.length;
  const completed = learnings.filter(item => item.completed).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

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
// QUESTIONS
// ==========================
questionForm.addEventListener("submit", (e) => {
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
      <div class="question-item" data-id="${item.id}">
        <input type="checkbox" ${item.revised ? "checked" : ""} class="toggle-revised"/>
        <div>
          <strong class="${item.revised ? "revised-text" : ""}">
            ${item.question}
          </strong>
          <p>${item.answer}</p>
        </div>
        <button class="delete-question">Delete</button>
      </div>
    `;

    questionList.appendChild(li);
  });
}

questionList.addEventListener("click", (e) => {
  const parent = e.target.closest(".question-item");
  if (!parent) return;

  const id = Number(parent.dataset.id);

  if (e.target.classList.contains("delete-question")) {
    questions = questions.filter(item => item.id !== id);
  }

  if (e.target.classList.contains("toggle-revised")) {
    questions = questions.map(item =>
      item.id === id ? { ...item, revised: !item.revised } : item
    );
  }

  saveQuestions();
  renderQuestions();
});

function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}