function setLocalData(name, value) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(name, value);
        return true;
    }
    alert("Web storage is not supported!");
    return false;
}

function getLocalData(name) {
    if (typeof(Storage) !== "undefined") {
        return localStorage.getItem(name);
    }
    alert("Web storage is not supported!");
    return null;
}

function getAllLocalData() {
    if (typeof(Storage) !== "undefined") {
        return JSON.stringify(localStorage);
    }
    alert("Web storage is not supported!");
    return null;
}

function saveUsername() {
    const username = document.getElementById("usernamebox").value.trim();
    if (!username) {
        alert("Please enter a valid username."); // Show an error if the username is empty
        return; // Exit the function early
    }
    localStorage.setItem("username", username); 
    window.location.href = "page-welcome.html"; 
}

// Check if the username is valid and enable/disable the Submit button
function checkValidUser() {
    const user = document.getElementById('usernamebox').value;
    const isValid = /^[a-zA-Z0-9]{1,20}$/.test(user);

    if (isValid) {
        document.getElementById('updateUser').innerHTML = '🧑‍🍳 Looks good!';
        document.getElementById('updateUser').className = 'valid';
        document.getElementById('submitbutton').disabled = false;
    } else {
        document.getElementById('updateUser').innerHTML = '⚠️ Use only letters/numbers (max 20 characters)';
        document.getElementById('updateUser').className = 'invalid';
        document.getElementById('submitbutton').disabled = true;
    }
}

function usernameChecker() {
    const username = localStorage.getItem("username");
    if (username) {
        window.location.href = "page-welcome.html";
    } else {
        window.location.href = "page-login.html";
    }
}

function resetAllData() {
    if (typeof(Storage) !== "undefined") {
        localStorage.removeItem("username");
        localStorage.removeItem("easyHighScore");
        localStorage.removeItem("mediumHighScore");
        localStorage.removeItem("hardHighScore");

        localStorage.setItem("easyHighScore", 0);
        localStorage.setItem("mediumHighScore", 0);
        localStorage.setItem("hardHighScore", 0);

        alert("All your data has been reset!");
        window.location.href = "page-home.html"; 
    } else {
        alert("Web storage is not supported!");
    }
}

function checkAuth() {
    const username = localStorage.getItem("username");
    const currentPage = window.location.pathname;

    if (currentPage.includes("page-welcome.html") && !username) {
        window.location.href = "page-login.html";
    } else if (currentPage.includes("page-login.html") && username) {
        window.location.href = "page-welcome.html";
    } else if (username && document.getElementById("user")) {
        document.getElementById("user").innerText = username;
    }
}

// Run authentication check on page load
document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
});