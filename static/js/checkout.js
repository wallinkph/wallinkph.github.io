import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';
import { addError } from "./ADDERROR.js";

const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
let newStocks = [];

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

        const name = document.getElementById("nameInput").value.trim();
        const contact = document.getElementById("contactInput").value.trim();
        const email = document.getElementById("emailInput").value.trim();
        const country = document.getElementById("countryDropdown").value;
        const province = document.getElementById("provinceDropdown").value;
        const city = document.getElementById("cityDropdown").value;
        const address = document.getElementById("addressInput").value.trim();
        const deliveryNote = document.getElementById("deliveryNoteInput").value.trim();
        const paymentMethod = document.getElementById("paymentMethodDropdown").value;
        const deliveryOption = document.getElementById("deliveryOptionDropdown").value;
        const date = document.getElementById("dateInput").value;
        const time = document.getElementById("timeInput").value;

        // Array of fields to check for emptiness, in order
        const fields = [
            { value: name, element: document.getElementById("nameInput") },
            { value: contact, element: document.getElementById("contactInput") },
            { value: email, element: document.getElementById("emailInput") },
            { value: country, element: document.getElementById("countryDropdown") },
            { value: province, element: document.getElementById("provinceDropdown") },
            { value: city, element: document.getElementById("cityDropdown") },
            { value: address, element: document.getElementById("addressInput") },
            { value: paymentMethod, element: document.getElementById("paymentMethodDropdown") },
            { value: deliveryOption, element: document.getElementById("deliveryOptionDropdown") },
            { value: date, element: document.getElementById("dateInput") },
            { value: time, element: document.getElementById("timeInput") }
        ];

        let firstEmptyField = null;
        fields.forEach((field) => {
            if (!field.value) {
                addError(document.getElementById(`${field.element.id}ErrorText`) || undefined, field.element, "This field is required");
                if (!firstEmptyField) firstEmptyField = field.element;
            }
        });

        // input validation
        // below

        // check name if it has special characters or numbers
        if (!/^[a-zA-Z\s]*$/.test(name)) {
            addError(document.getElementById("nameInputErrorText"), document.getElementById("nameInput"), "Invalid name format (no special characters or numbers)");
            if (!firstEmptyField) firstEmptyField = document.getElementById("nameInput");
        }

        // check if contact is a number and has 11 digits
        if (contact.length !== 11 || isNaN(contact)) {
            addError(document.getElementById("contactInputErrorText"), document.getElementById("contactInput"), "Invalid contact number");
            if (!firstEmptyField) firstEmptyField = document.getElementById("contactInput");
        }

        // check if email is valid format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            addError(document.getElementById("emailInputErrorText"), document.getElementById("emailInput"), "Invalid email format");
            if (!firstEmptyField) firstEmptyField = document.getElementById("emailInput");
        }

        if (date < localStorage.getItem('minDate')) {
            addError(document.getElementById("dateInputErrorText"), document.getElementById("dateInput"), "Invalid date");
            if (!firstEmptyField) firstEmptyField = document.getElementById("dateInput");
        }

        if (firstEmptyField) {
            firstEmptyField.focus();
            return;
        }

        const orderDetailsArray = JSON.parse(localStorage.getItem('pendingOrders')) || [];
        const orderDetails = {
            orderNumber: Math.floor(Math.random() * 1000000000),
            name, contact, email, country, province, city, address,
            deliveryNote, paymentMethod, deliveryOption, date, time,
            orderItems: cart,
            status: "pending"
        };

        orderDetailsArray.push(orderDetails);
        localStorage.setItem('pendingOrders', JSON.stringify(orderDetailsArray));
        localStorage.setItem('newStocks', JSON.stringify(newStocks));
        localStorage.removeItem('cartItems');

        if (paymentMethodSelect.value === "gcash") {
            window.location.href = "../html/CHECKOUTGCASHQR.html";
        } else {
            window.location.href = "../html/CHECKOUTCOD.html";
        }
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
                <p>${orderDetails[i].referenceNumber}</p>
            </div>
        `;
        orderListContainer.appendChild(orderItem);
        totalPrices += orderDetails[i].subtotal;
        newStocks.push({
            referenceNumber: orderDetails[i].referenceNumber,
            newStock: orderDetails[i].stock - orderDetails[i].quantity
        });
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