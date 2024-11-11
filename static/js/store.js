import { openDatabase, addData, getData, updateData, deleteData } from './DB.js';

const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
// HARD CODED DATA FOR TESTING
// ADD DESCRIPTION AND PRICING LATER
const productDetails = [
    {
        name: "Vanilla",
        price: 435,
        stock: 15,
        imageSrc: "../../media/ice-creams/Vanilla_ice_cream.png"
    },
    {
        name: "Chocolate",
        price: 362,
        stock: 8,
        imageSrc: "../../media/ice-creams/Chocolate_ice_cream.png"
    },
    {
        name: "Strawberry",
        price: 489,
        stock: 3,
        imageSrc: "../../media/ice-creams/Strawberry_ice_cream.png"
    },
    {
        name: "Mint Chocolate Chip",
        price: 375,
        stock: 12,
        imageSrc: "../../media/ice-creams/Mint_Chocolate_Chip_ice_cream.png"
    },
    {
        name: "Cookie Dough",
        price: 416,
        stock: 5,
        imageSrc: "../../media/ice-creams/Cookie_Dough_ice_cream.png"
    },
    {
        name: "Rocky Road",
        price: 457,
        stock: 10,
        imageSrc: "../../media/ice-creams/Rocky_Road_ice_cream.png"
    },
    {
        name: "Pistachio",
        price: 305,
        stock: 7,
        imageSrc: "../../media/ice-creams/Pistachio_ice_cream.png"
    },
    {
        name: "Salted Caramel",
        price: 329,
        stock: 20,
        imageSrc: "../../media/ice-creams/Salted_Caramel_ice_cream.png"
    },
    {
        name: "Mango Sorbet",
        price: 491,
        stock: 4,
        imageSrc: "../../media/ice-creams/Mango_Sorbet_ice_cream.png"
    },
    {
        name: "Butter Pecan",
        price: 355,
        stock: 0,
        imageSrc: "../../media/ice-creams/Butter_Pecan_ice_cream.png"
    },
    {
        name: "Boku No Pico Ice Cream",
        price: 9999.99,
        stock: 1,
        imageSrc: "../../media/ice-creams/Boku_No_Pico_Ice_Cream.jpg"

    }
];
    

function generateGridItems(numberOfItems, productDetails) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    for (let i = 0; i < numberOfItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        const inputId = `numberInput-${i}`;
        const buttonId = `addToCartButton-${i}`;

        gridItem.innerHTML = `
            <img src="${productDetails[i].imageSrc}" alt="Product image" class="itemImage">
            <div class="item-info">
                <h3 class="itemName" title="${productDetails[i].name}">${productDetails[i].name}</h3>
                <div class="item-pricing-box">
                    <h2 class="itemPrice">PHP ${productDetails[i].price}</h2>
                    <p class="inStocks">In stocks: ${productDetails[i].stock}</p>
                    <div class="increment-box">
                        <input type="number" class="numberInput" id="${inputId}" value="0" min="0" max="10" step="1">
                    </div>
                </div>
                <button class="addToCartButton" id="${buttonId}">Add</button>
            </div>
        `;
        gridContainer.appendChild(gridItem);
        document.getElementById(buttonId).addEventListener('click', () => {
            const quantity = parseInt(document.getElementById(inputId).value, 10);
            if (quantity > 0) {
                addToCart({
                    inputId: inputId,
                    buttonId: buttonId,
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
    }
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.subtotal += item.subtotal;
    } else {
        cart.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

async function fetchGridItems() {
    try {
        const response = await fetch("/api/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        switch (response.status) {
            case 200:
                generateGridItems(data.length, data);
                break;
            default:
                alert("Something went wrong");
                break;
        }
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

document.addEventListener('DOMContentLoaded', () => {
    generateGridItems(productDetails.length, productDetails);
    // fetchGridItems();
    checkoutButtonListener();
    viewCartButtonListener();
    pendingOrdersListener();
    // localStorage.removeItem('cartItems');
});




















// DB SECTION