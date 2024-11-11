import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';

const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
const dbName = 'cartDB';
const storeName = 'cartItems';

function generateGridItems(numberOfItems, productDetails) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    for (let i = 0; i < numberOfItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        const inputId = productDetails[i].inputId;
        const buttonId = productDetails[i].buttonId;
        const removeButtonId = `removeFromCartButton-${i}`;

        gridItem.innerHTML = `
            <img src="${productDetails[i].imageSrc}" alt="Product image" class="itemImage">
            <div class="item-info">
                <h3 class="itemName" title="${productDetails[i].name}">${productDetails[i].name}</h3>
                <div class="item-pricing-box">
                    <h2 class="itemPrice">PHP ${productDetails[i].price}</h2>
                    <p class="inStocks">In stocks: ${productDetails[i].stock}</p>
                    <div class="increment-box">
                        <input type="number" class="numberInput" id="${inputId}" value="${productDetails[i].quantity}" min="0" max="10" step="1">
                    </div>
                </div>
                <div class="item-buttons">
                    <button class="saveButton" id="${buttonId}">Save</button>
                    <button class="removeFromCartButton" id="${removeButtonId}">Remove</button>
                </div>
            </div>
        `;
        gridContainer.appendChild(gridItem);
        document.getElementById(buttonId).addEventListener('click', () => {
            const quantity = parseInt(document.getElementById(inputId).value, 10);
            if (quantity > 0) {
                addToCart({
                    name: productDetails[i].name,
                    price: productDetails[i].price,
                    quantity: quantity,
                    subtotal: productDetails[i].price * quantity,
                    stock: productDetails[i].stock,
                    imageSrc: productDetails[i].imageSrc
                });
            } else {
                document.getElementById(inputId).style.border = '1px solid red';
                setTimeout(() => document.getElementById(inputId).style.border = '1px solid #ccc', 2000);
            }
        });
        document.getElementById(removeButtonId).addEventListener('click', () => {
            removeFromCart(productDetails[i].name);
        });
    }
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity = item.quantity;
        existingItem.subtotal = item.subtotal;
    } else {
        cart.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

function initCart() {
    if (cart.length === 0) {
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.style.display = 'none';
        
        const status = document.getElementById('status');
        status.innerHTML = 'No items in cart';
        status.style.display = 'flex';
        status.style.justifyContent = 'center';
        status.style.alignItems = 'center';
        status.style.height = '100vh';
        status.style.color = '#666';
    } else {
        generateGridItems(cart.length, cart);
    }
}

function removeFromCart(name) {
    const itemIndex = cart.findIndex(cartItem => cartItem.name === name);
    cart.splice(itemIndex, 1);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    location.reload();
}

function checkoutButtonListener() {
    const checkoutButton = document.getElementById("checkoutButton");
    checkoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('No items in cart.');
            return;
        }
        window.location.href = "../html/checkout.html";
    });
}

function pendingOrdersListener() {
    const pendingOrdersButton = document.getElementById("pendingOrdersButton");
    pendingOrdersButton.addEventListener("click", () => {
        window.location.href = "../html/CHECKOUTPENDING.html";
    });
}

function homeButtonListener() {
    const checkoutButton = document.getElementById("homeButton");
    checkoutButton.addEventListener("click", () => {
        window.location.href = "../html/store.html";
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    checkoutButtonListener();
    pendingOrdersListener();
    homeButtonListener();
});




















// DB SECTION using IndexedDB