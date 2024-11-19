import { openDB, addData, getData, getAllData, updateData, deleteData, clearData, closeDB } from "./DB.js";

let db = null;
let cart = [];

async function refreshCart() {
    try {
        cart = await getAllData(db, 'cartItems');
        if (!cart) cart = [];
    } catch (error) {
        console.error("Error:", error);
    }
}

const productDetails = [
    { name: "Vanilla", price: 435, stock: 15, imageSrc: "../../media/ice-creams/Vanilla_ice_cream.png" },
    { name: "Chocolate", price: 362, stock: 8, imageSrc: "../../media/ice-creams/Chocolate_ice_cream.png" },
    { name: "Strawberry", price: 489, stock: 3, imageSrc: "../../media/ice-creams/Strawberry_ice_cream.png" },
    { name: "Mint Chocolate Chip", price: 375, stock: 12, imageSrc: "../../media/ice-creams/Mint_Chocolate_Chip_ice_cream.png" },
    { name: "Cookie Dough", price: 416, stock: 5, imageSrc: "../../media/ice-creams/Cookie_Dough_ice_cream.png" },
    { name: "Rocky Road", price: 457, stock: 10, imageSrc: "../../media/ice-creams/Rocky_Road_ice_cream.png" },
    { name: "Pistachio", price: 305, stock: 7, imageSrc: "../../media/ice-creams/Pistachio_ice_cream.png" },
    { name: "Salted Caramel", price: 329, stock: 20, imageSrc: "../../media/ice-creams/Salted_Caramel_ice_cream.png" },
    { name: "Mango Sorbet", price: 491, stock: 4, imageSrc: "../../media/ice-creams/Mango_Sorbet_ice_cream.png" },
    { name: "Butter Pecan", price: 355, stock: 0, imageSrc: "../../media/ice-creams/Butter_Pecan_ice_cream.png" },
    { name: "Boku No Pico Ice Cream", price: 9999, stock: 1, imageSrc: "../../media/ice-creams/Boku_No_Pico_Ice_Cream.jpg" }
];

function addReferenceNumbers(products) {
    products.forEach((product, index) => {
        product.referenceNumber = `REF-${String(index + 1).padStart(3, '0')}`;
    });
}
addReferenceNumbers(productDetails);
    
function saveSelectedItem(item) {
    localStorage.setItem('selectedItem', JSON.stringify(item));
    window.location.href = "../html/item.html";
}

function generateGridItems(numberOfItems, productDetails) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    for (let i = 0; i < numberOfItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        const inputId = `numberInput-${i}`;
        const buttonId = `addToCartButton-${i}`;
        const sizeId = `size-${i}`;

        gridItem.innerHTML = `
            <img src="${productDetails[i].imageSrc}" alt="Product image" class="itemImage">
            <div class="item-info">
                <h3 class="itemName" title="${productDetails[i].name}">${productDetails[i].name}</h3>
                <div class="item-pricing-box">
                    <h2 class="itemPrice">₱${productDetails[i].price}</h2>
                    <p class="inStocks">In stocks: ${productDetails[i].stock}</p>
                    <div class="increment-box">
                        <button class="decrementButton" id="decrementButton-${i}">-</button>
                        <input type="number" class="numberInput" id="${inputId}" value="0" min="0" max="10" step="1">
                        <button class="incrementButton" id="incrementButton-${i}">+</button>
                    </div>
                    <div class="size-box">
                        <label for="size">Size:</label>
                        <select name="size" id="${sizeId}">
                            <option value="small" selected>Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <p>${productDetails[i].referenceNumber}</p>
                </div>
                <button class="addToCartButton" id="${buttonId}">Add</button>
            </div>
        `;
        gridContainer.appendChild(gridItem);

        gridItem.querySelector('.itemName').addEventListener('click', () => {
            saveSelectedItem(productDetails[i]);
        });

        document.getElementById(buttonId).addEventListener('click', async () => {
            const quantity = parseInt(document.getElementById(inputId).value, 10);
            if (quantity > 0) {
                await addToCart({
                    inputId: inputId,
                    buttonId: buttonId,
                    sizeId: sizeId,
                    name: productDetails[i].name,
                    price: productDetails[i].price,
                    quantity: quantity,
                    subtotal: productDetails[i].price * quantity,
                    stock: productDetails[i].stock,
                    imageSrc: productDetails[i].imageSrc,
                    size: document.getElementById(sizeId).value,
                    referenceNumber: productDetails[i].referenceNumber
                });
                alert(`${quantity} ${productDetails[i].name} added to cart.`);
                cart = refreshCart();
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
    }
}

async function addToCart(item) {
    try {
        const existingItem = await getData(db, 'cartItems', item.referenceNumber);
        if (existingItem) {
            existingItem.quantity = item.quantity;
            existingItem.subtotal = existingItem.price * item.quantity;
            await updateData(db, 'cartItems', existingItem);
        } else {
            await addData(db, 'cartItems', { ...item });
        }
        console.log('Item added to cart:', item);
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

function viewCartButtonListener() {
    const viewCartButton = document.getElementById("viewCartButton");
    viewCartButton.addEventListener("click", () => {
        window.location.href = "../html/cart.html";
    });
}

function pendingOrdersListener() {
    const pendingOrdersButton = document.getElementById("pendingOrdersButton");
    pendingOrdersButton.addEventListener("click", () => {
        window.location.href = "../html/CHECKOUTPENDING.html";
    });
}

function closeDBConnection() {
    const closeDBButton = document.getElementById("closeDBButton");
    closeDBButton.addEventListener("click", () => {
        closeDB(db);
        console.log("Database connection closed.");
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    db = await openDB();
    await refreshCart();
    closeDBConnection();

    const newStocks = JSON.parse(localStorage.getItem('newStocks')) || [];
    newStocks.forEach(newStock => {
        const productIndex = productDetails.findIndex(product => product.referenceNumber === newStock.referenceNumber);
        if (productIndex !== -1) {
            productDetails[productIndex].stock = newStock.newStock;
        }
    });


    generateGridItems(productDetails.length, productDetails);
    checkoutButtonListener();
    viewCartButtonListener();
    pendingOrdersListener();
});