import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';

function submitButtonListener() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validation
        let isValid = true;
        if (!email) {
            alert("Email is required");
            isValid = false;
        } else {
            if (email.includes("@")) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    alert("Email is invalid");
                    isValid = false;
                }
            } else {
                if (!/^[a-zA-Z0-9-_]*$/.test(email)) {
                    alert("Username can only contain letters, numbers, - and _");
                    isValid = false;
                }
            }
        }
        if (!password) {
            alert("Password is required");
            isValid = false;
        }
        if (!isValid) return;
        // login(email, password);

        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        window.location.href = "../html/welcome.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    submitButtonListener();
});




















// DB SECTION