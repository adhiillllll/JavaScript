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

const learningSearch = document.getElementById("learningSearch");
const learningFilter = document.getElementById("learningFilter");

const questionSearch = document.getElementById("questionSearch");
const questionFilter = document.getElementById("questionFilter");
const themeToggle = document.getElementById("themeToggle");

const learningSort = document.getElementById("learningSort");
const exportBtn = document.getElementById("exportData");
const importInput = document.getElementById("importData");

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

learningSearch.addEventListener("input", renderLearnings);
learningFilter.addEventListener("change", renderLearnings);

questionSearch.addEventListener("input", renderQuestions);
questionFilter.addEventListener("change", renderQuestions);

learningSort.addEventListener("change", renderLearnings);

// ==========================
// THEME
// ==========================

function setupTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "🌞 Light Mode";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark
      ? "🌞 Light Mode"
      : "🌙 Dark Mode";
  });
}

setupTheme();

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

  const searchValue = learningSearch.value.toLowerCase();
  const filterValue = learningFilter.value;

  let filtered = learnings.filter(item =>
    item.topic.toLowerCase().includes(searchValue)
  );

  if (filterValue === "completed") {
    filtered = filtered.filter(item => item.completed);
  }

  if (filterValue === "pending") {
    filtered = filtered.filter(item => !item.completed);
  }

  if (filtered.length === 0) {
    learningList.innerHTML = "<p>No matching learning found.</p>";
    updateProgress();
    return;
  }

  const sortValue = learningSort.value;

if (sortValue === "newest") {
  filtered.sort((a, b) => b.id - a.id);
}

if (sortValue === "oldest") {
  filtered.sort((a, b) => a.id - b.id);
}

  filtered.forEach(item => {
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

        <div>
          <button class="edit-learning">Edit</button>
          <button class="delete-learning">Delete</button>
        </div>
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

  // Delete
  if (e.target.classList.contains("delete-learning")) {
    learnings = learnings.filter(item => item.id !== id);
  }

  // Toggle
  if (e.target.classList.contains("toggle-complete")) {
    learnings = learnings.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
  }

  // Edit
  if (e.target.classList.contains("edit-learning")) {
    const item = learnings.find(l => l.id === id);

    const newTopic = prompt("Edit topic:", item.topic);
    const newNotes = prompt("Edit notes:", item.notes);

    if (newTopic && newNotes) {
      learnings = learnings.map(l =>
        l.id === id ? { ...l, topic: newTopic, notes: newNotes } : l
      );
    }
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

  const searchValue = questionSearch.value.toLowerCase();
  const filterValue = questionFilter.value;

  let filtered = questions.filter(item =>
    item.question.toLowerCase().includes(searchValue)
  );

  if (filterValue === "revised") {
    filtered = filtered.filter(item => item.revised);
  }

  if (filterValue === "not-revised") {
    filtered = filtered.filter(item => !item.revised);
  }

  if (filtered.length === 0) {
    questionList.innerHTML = "<p>No matching question found.</p>";
    return;
  }

  filtered.forEach(item => {
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

        <div>
          <button class="edit-question">Edit</button>
          <button class="delete-question">Delete</button>
        </div>
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

  if (e.target.classList.contains("edit-question")) {
    const item = questions.find(q => q.id === id);

    const newQuestion = prompt("Edit question:", item.question);
    const newAnswer = prompt("Edit answer:", item.answer);

    if (newQuestion !== null && newAnswer !== null) {
      questions = questions.map(q =>
        q.id === id
          ? { ...q, question: newQuestion, answer: newAnswer }
          : q
      );
    }
  }

  saveQuestions();
  renderQuestions();
});

function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

exportBtn.addEventListener("click", () => {
  const data = {
    learnings,
    questions,
    streakData
  };

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "js-master-tracker-backup.json";
  a.click();

  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);

      learnings = data.learnings || [];
      questions = data.questions || [];
      streakData = data.streakData || { count: 0, lastDate: null };

      saveLearnings();
      saveQuestions();
      localStorage.setItem("streakData", JSON.stringify(streakData));

      renderLearnings();
      renderQuestions();
      updateStreakUI();

      alert("Data imported successfully!");
    } catch (err) {
      alert("Invalid backup file.");
    }
  };

  reader.readAsText(file);
});