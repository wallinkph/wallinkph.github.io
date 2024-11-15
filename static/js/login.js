import { addError } from "./ADDERROR.js";
import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';

function submitButtonListener() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const email = emailInput.value;
        const password = passwordInput.value;

        // Validation
        let isValid = true;
        if (!email) {
            addError(emailInput);
            alert("Email is required");
            isValid = false;
        } else {
            if (email.includes("@")) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    addError(emailInput);
                    alert("Email is invalid");
                    isValid = false;
                }
            } else {
                if (!/^[a-zA-Z0-9-_]*$/.test(email)) {
                    addError(emailInput);
                    alert("Username can only contain letters, numbers, - and _");
                    isValid = false;
                }
            }
        }
        if (!password) {
            addError(passwordInput);
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