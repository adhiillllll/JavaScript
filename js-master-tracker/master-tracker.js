const dateElement = document.getElementById("currentDate");

function showDate() {
  const today = new Date();
  dateElement.textContent = today.toDateString();
}

showDate();