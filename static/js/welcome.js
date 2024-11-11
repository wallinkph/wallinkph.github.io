import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';

function storeButtonListener() {
    const button = document.getElementById("storeButton");
    button.addEventListener("click", () => {
        window.location.href = "../html/store.html";
    });
}

function greetUser() {
    const username = localStorage.getItem("username");
    if (!username) document.getElementById("promptText").innerText = "Welcome!";
    else document.getElementById("promptText").innerText = `Welcome, ${username}!`;
}

document.addEventListener("DOMContentLoaded", () => {
    storeButtonListener();
    greetUser();
});




















// DB SECTION