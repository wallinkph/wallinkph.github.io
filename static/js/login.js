import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';

function submitButtonListener() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        console.log(email, password);

        // try {
        //     const response = await fetch("/login", {
        //         method: "POST",
        //         body: JSON.stringify({
        //             email: email,
        //             password: password
        //         }),
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     });

        //     const data = await response.json();
        //     switch (response.status) {
        //         case 200:
        //             window.location.href = "/welcome";
        //             break;
        //         case 401:
        //             alert(data.message);
        //             break;
        //         default:
        //             alert("Something went wrong");
        //             break;
        //     }
        // } catch (error) {
        //     console.error("Error:", error);
        // }

        // save credentials
        // HARD CODED
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        window.location.href = "../html/welcome.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    submitButtonListener();
});




















// DB SECTION