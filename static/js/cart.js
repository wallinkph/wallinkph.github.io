import { openDB, addData, getData, getAllData, updateData, deleteData, clearData, closeDB } from "./DB.js";

let db = null;
let cart = [];

async function initCart() {
    try {
        cart = await getAllData(db, 'cartItems');
        if (!cart) cart = [];
    } catch (error) {
        console.error("Error:", error);
    }
}


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
                        <button class="incrementButton" id="incrementButton-${i}">+</button>
                        <input type="number" class="numberInput" id="${inputId}" value="${productDetails[i].quantity}" min="0" max="10" step="1">
                        <button class="decrementButton" id="decrementButton-${i}">-</button>
                    </div>
                    <p>${productDetails[i].referenceNumber}</p>
                </div>
                <div class="item-buttons">
                    <button class="saveButton" id="${buttonId}">Save</button>
                    <button class="removeFromCartButton" id="${removeButtonId}">Remove</button>
                </div>
            </div>
        `;

        gridContainer.appendChild(gridItem);
        document.getElementById(buttonId).addEventListener('click', async () => {
            const quantity = parseInt(document.getElementById(inputId).value, 10);
            if (quantity > 0) {
                await addToCart({
                    name: productDetails[i].name,
                    price: productDetails[i].price,
                    quantity: quantity,
                    subtotal: productDetails[i].price * quantity,
                    stock: productDetails[i].stock,
                    imageSrc: productDetails[i].imageSrc,
                    referenceNumber: productDetails[i].referenceNumber
                });
            } else {
                document.getElementById(inputId).style.border = '1px solid red';
                setTimeout(() => document.getElementById(inputId).style.border = '1px solid #ccc', 2000);
            }
        });
        document.getElementById(`incrementButton-${i}`).addEventListener('click', () => {
            const input = document.getElementById(inputId);
            // limit is the max stock of the item
            input.value = Math.min(parseInt(input.value, 10) + 1, productDetails[i].stock);
        });
        document.getElementById(`decrementButton-${i}`).addEventListener('click', () => {
            const input = document.getElementById(inputId);
            input.value = Math.max(parseInt(input.value, 10) - 1, 0);
        });
        document.getElementById(removeButtonId).addEventListener('click', async () => {
            await removeFromCart(productDetails[i].referenceNumber);
        });
    }
}

async function addToCart(item) {
    const existingItem = await getData(db, 'cartItems', item.referenceNumber);
    if (existingItem) {
        existingItem.quantity = item.quantity;
        existingItem.subtotal = item.subtotal;
        await updateData(db, 'cartItems', existingItem);
    } else {
        await addData(db, 'cartItems', { ...item });
    }
    console.log('Item added to cart:', item);
}

async function init() {
    await initCart();

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

async function removeFromCart(referenceNumber) {
    try {
        await deleteData(db, 'cartItems', referenceNumber);
        location.reload();
    } catch (error) {
        console.error("Error:", error);
    }
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

document.addEventListener('DOMContentLoaded', async () => {
    db = await openDB();
    await init();

    checkoutButtonListener();
    pendingOrdersListener();
    homeButtonListener();
});