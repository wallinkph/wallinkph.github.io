import { openDB, addData, getData, getAllData, updateData, deleteData, clearData, closeDB } from "./DB.js";

function nextButtonListener() {
    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", () => {
        window.location.href = "../html/CHECKOUTPENDING.html";
    });
}

function setPriceAmount() {
    const totalPrice = localStorage.getItem('totalPrice');
    const priceAmount = document.getElementById("amountToPay");
    priceAmount.innerHTML = `₱${totalPrice}`;
}

document.addEventListener("DOMContentLoaded", () => {
    nextButtonListener();
    setPriceAmount();
});




















// DB SECTION