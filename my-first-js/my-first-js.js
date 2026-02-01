// Check login when page loads
window.onload = function () {
  checkLogin();
};

function login() {
  const username = document.getElementById("username").value;

  if (username === "") {
    alert("Please enter username");
    return;
  }

  // Save to localStorage
  localStorage.setItem("user", username);
  localStorage.setItem("isLoggedIn", "true");

  checkLogin();
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");

  document.getElementById("status").innerText = "Not logged in";
}

function checkLogin() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = localStorage.getItem("user");

  if (isLoggedIn === "true") {
    document.getElementById("status").innerText =
      "Logged in as " + user;
  } else {
    document.getElementById("status").innerText =
      "Not logged in";
  }
}
