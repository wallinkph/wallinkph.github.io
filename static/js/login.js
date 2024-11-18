import { addError } from "./ADDERROR.js";
import { openDB, addData, getData, getAllData, updateData, deleteData, clearData, closeDB } from "./DB.js";

function submitButtonListener() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const email = emailInput.value;
        const password = passwordInput.value;

        const fields = [
            { value: email, element: emailInput },
            { value: password, element: passwordInput }
        ];

        let firstEmptyField = null;
        fields.forEach((field) => {
            if (!field.value) {
                addError(document.getElementById(`${field.element.id}ErrorText`) || undefined, field.element, "This field is required");
                if (!firstEmptyField) firstEmptyField = field.element;
            }
        });

        // Validation
        if (!email) {
            addError(document.getElementById("emailErrorText"), emailInput, "Email is required");
            if (!firstEmptyField) firstEmptyField = emailInput;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            addError(document.getElementById("emailErrorText"), emailInput, "Invalid email format");
            if (!firstEmptyField) firstEmptyField = emailInput;
        }

        if (firstEmptyField) {
            firstEmptyField.focus();
            return;
        }

        if (!password) {
            addError(document.getElementById("passwordErrorText"), passwordInput, "Password is required");
            if (!firstEmptyField) firstEmptyField = passwordInput;
        }


        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        window.location.href = "../html/welcome.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    submitButtonListener();
});




















// DB SECTION