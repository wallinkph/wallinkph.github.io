import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';
import { addError } from "./ADDERROR.js";

const cart = JSON.parse(localStorage.getItem('cartItems')) || [];

function defaultValues() {
    //  the hell is this
    const name = document.getElementById("nameInput");
    const contact = document.getElementById("contactInput");
    const email = document.getElementById("emailInput");
    const country = document.getElementById("countryDropdown");
    const province = document.getElementById("provinceDropdown");
    const city = document.getElementById("cityDropdown");
    const address = document.getElementById("addressInput");
    const paymentMethod = document.getElementById("paymentMethodDropdown");
    const deliveryOption = document.getElementById("deliveryOptionDropdown");
    const date = document.getElementById("dateInput");
    const time = document.getElementById("timeInput");
    
    name.value = "";
    contact.value = "";
    country.selectedIndex = 0;
    province.selectedIndex = 0;
    city.selectedIndex = 0;
    address.value = "";
    paymentMethod.selectedIndex = 0;
    deliveryOption.selectedIndex = 0;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = tomorrow.getDate();
    const month = tomorrow.getMonth() + 1;
    const year = tomorrow.getFullYear();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    date.value = formattedDate;
    time.value = "12:00";

    date.min = formattedDate;
    localStorage.setItem('minDate', formattedDate);
}

function submitButtonListener() {
    const submitButton = document.getElementById("submitButton");
    const paymentMethodSelect = document.getElementById("paymentMethodDropdown");
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();

        const name = document.getElementById("nameInput").value.trim() || "";
        const contact = document.getElementById("contactInput").value.trim() || "";
        const email = document.getElementById("emailInput").value.trim() || "";
        const country = document.getElementById("countryDropdown").value || "";
        const province = document.getElementById("provinceDropdown").value || "";
        const city = document.getElementById("cityDropdown").value || "";
        const address = document.getElementById("addressInput").value.trim() || "";
        const deliveryNote = document.getElementById("deliveryNoteInput").value.trim() || "";
        const paymentMethod = document.getElementById("paymentMethodDropdown").value || "";
        const deliveryOption = document.getElementById("deliveryOptionDropdown").value || "";
        const date = document.getElementById("dateInput").value;
        const time = document.getElementById("timeInput").value;

        if (!name) addError(document.getElementById("nameInput"));
        if (!contact) addError(document.getElementById("contactInput"));
        if (!country) addError(document.getElementById("countryDropdown"));
        if (!province) addError(document.getElementById("provinceDropdown"));
        if (!city) addError(document.getElementById("cityDropdown"));
        if (!address) addError(document.getElementById("addressInput"));
        if (!paymentMethod) addError(document.getElementById("paymentMethodDropdown"));
        if (!deliveryOption) addError(document.getElementById("deliveryOptionDropdown"));
        if (!date) addError(document.getElementById("dateInput"));
        if (date < localStorage.getItem('minDate')) addError(document.getElementById("dateInput"));
        if (!time) addError(document.getElementById("timeInput"));

        if (!name || !contact || !country || !province || !city || !address || !paymentMethod || !deliveryOption || !date || !time) return;

        // save to local storage
        const orderDetailsArray = JSON.parse(localStorage.getItem('pendingOrders')) || [];
        const length = orderDetailsArray.length;
        const orderDetails = {
            orderNumber: length,
            name: name,
            contact: contact,
            email: email,
            country: country,
            province: province,
            city: city,
            address: address,
            deliveryNote: deliveryNote,
            paymentMethod: paymentMethod,
            deliveryOption: deliveryOption,
            date: date,
            time: time,
            orderItems: cart,
            status: "pending"
        };

        orderDetailsArray.push(orderDetails);
        localStorage.setItem('pendingOrders', JSON.stringify(orderDetailsArray));

        if (paymentMethodSelect.value === "gcash") window.location.href = "../html/CHECKOUTGCASHQR.html";
        else window.location.href = "../html/CHECKOUTCOD.html";
    });
}

function resetButtonListener() {
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", (e) => {
        e.preventDefault();
        defaultValues();
    });
}

function generateOrderItems(numberOfItems, orderDetails) {
    const orderListContainer = document.querySelector('.order-list-container');
    orderListContainer.innerHTML = '';
    let totalPrices = 0;

    for (let i = 0; i < numberOfItems; i++) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        orderItem.innerHTML = `
            <img src="${orderDetails[i].imageSrc}" alt="Product image">
            <div class="order-item-info">
                <p class="productName">${orderDetails[i].name}</p>
                <p class="productPrice">PHP ${orderDetails[i].price}</p>
                <p class="productQuantity">Quantity: ${orderDetails[i].quantity}</p>
                <p class="productSubtotal">Subtotal: PHP ${orderDetails[i].subtotal}</p>
            </div>
        `;
        orderListContainer.appendChild(orderItem);
        totalPrices += orderDetails[i].subtotal;
    }
    document.getElementById("totalPrice").innerText = `Total: PHP ${totalPrices}`;

    //  save total price to local storage
    localStorage.setItem('totalPrice', totalPrices);
}

async function fetchOrderItems() {
    try {
        const response = await fetch("/api/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        switch (response.status) {
            case 200:
                generateOrderItems(data.length, data);
                break;
            default:
                alert("Something went wrong");
                break;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // fetchOrderItems();
    submitButtonListener();
    resetButtonListener();
    defaultValues();
    generateOrderItems(cart.length, cart);
});




















// DB SECTION