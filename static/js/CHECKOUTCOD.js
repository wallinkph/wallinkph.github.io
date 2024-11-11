import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';

function nextButtonListener() {
    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", () => {
        window.location.href = "../html/CHECKOUTPENDING.html";
    });
}

function setPriceAmount() {
    const totalPrice = localStorage.getItem('totalPrice');
    const priceAmount = document.getElementById("amountToPay");
    priceAmount.innerHTML = `PHP ${totalPrice}`;
}

document.addEventListener("DOMContentLoaded", () => {
    nextButtonListener();
    setPriceAmount();
});




















// DB SECTION