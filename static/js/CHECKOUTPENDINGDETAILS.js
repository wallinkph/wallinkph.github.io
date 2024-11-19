
const selectedOrder = JSON.parse(localStorage.getItem('selectedOrder')) || [];

function loadFormValues() {
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    const selectedOrderNumber = selectedOrder.orderNumber;

    const selectedOrderDetails = pendingOrders.find(order => order.orderNumber === selectedOrderNumber);
    
    const name = document.getElementById("nameInput");
    const contact = document.getElementById("contactInput");
    const email = document.getElementById("emailInput");

    const country = document.getElementById("countryDropdown");
    const province = document.getElementById("provinceDropdown");
    const city = document.getElementById("cityDropdown");
    const countryValue = document.getElementById("countryValue");
    const provinceValue = document.getElementById("provinceValue");
    const cityValue = document.getElementById("cityValue");

    const address = document.getElementById("addressInput");
    const deliveryNote = document.getElementById("deliveryNoteInput");
    const paymentMethod = document.getElementById("paymentMethodDropdown");
    const deliveryOption = document.getElementById("deliveryOptionDropdown");
    const date = document.getElementById("dateInput");
    const time = document.getElementById("timeInput");

    // make the inputs not modifiable
    name.disabled = true;
    contact.disabled = true;
    email.disabled = true;
    country.disabled = true;
    province.disabled = true;
    city.disabled = true;
    address.disabled = true;
    deliveryNote.disabled = true;
    paymentMethod.disabled = true;
    deliveryOption.disabled = true;
    date.disabled = true;
    time.disabled = true;

    // set the values of the inputs
    name.value = selectedOrderDetails.name;
    contact.value = selectedOrderDetails.contact;
    email.value = selectedOrderDetails.email;
    countryValue.innerText = selectedOrderDetails.country;
    provinceValue.innerText = selectedOrderDetails.province;
    cityValue.innerText = selectedOrderDetails.city;
    address.value = selectedOrderDetails.address;
    deliveryNote.value = selectedOrderDetails.deliveryNote;
    paymentMethod.value = selectedOrderDetails.paymentMethod;
    deliveryOption.value = selectedOrderDetails.deliveryOption;
    date.value = selectedOrderDetails.date;
    time.value = selectedOrderDetails.time;
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
                <p class="productPrice">₱${orderDetails[i].price}</p>
                <p class="productQuantity">Quantity: ${orderDetails[i].quantity}</p>
                <p class="productSize">Size: ${orderDetails[i].size}</p>
                <p class="productSubtotal">Subtotal: ₱${orderDetails[i].subtotal}</p>
            </div>
        `;
        orderListContainer.appendChild(orderItem);

        // calculate the price relative to the quantity and size
        // size = small, medium, large and multiply the price by 1.0, 2, 2.5 respectively

        const originalSubtotal = orderDetails[i].subtotal;

        if (orderDetails[i].size === "small") {
            orderDetails[i].subtotal = orderDetails[i].price * orderDetails[i].quantity;
        } else if (orderDetails[i].size === "medium") {
            orderDetails[i].subtotal = orderDetails[i].price * orderDetails[i].quantity * 1.5;
        } else if (orderDetails[i].size === "large") {
            orderDetails[i].subtotal = orderDetails[i].price * orderDetails[i].quantity * 2;
        }

        const productSize = orderItem.querySelector('.productSize');
        const subTotal = orderItem.querySelector('.productSubtotal');
        productSize.innerText = `Size: ${orderDetails[i].size}`;
        subTotal.innerHTML = `Subtotal: ₱${orderDetails[i].subtotal} <span style="text-decoration: underline;">(₱${originalSubtotal} [₱${orderDetails[i].price} x ${orderDetails[i].quantity}] + ₱${orderDetails[i].subtotal - originalSubtotal} [size])</span>`;


        totalPrices += orderDetails[i].subtotal;
    }
    document.getElementById("totalPrice").innerText = `Total: ₱${totalPrices}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const correctSelectedOrder = selectedOrder.orderItems.map(item => {
        return {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            subtotal: item.subtotal,
            stock: item.stock,
            imageSrc: item.imageSrc
        }
    });
    generateOrderItems(correctSelectedOrder.length, correctSelectedOrder);
    loadFormValues();
});




















// DB SECTION