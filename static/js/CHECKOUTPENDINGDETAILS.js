
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
                <p class="productPrice">PHP ${orderDetails[i].price}</p>
                <p class="productQuantity">Quantity: ${orderDetails[i].quantity}</p>
                <p class="productSubtotal">Subtotal: PHP ${orderDetails[i].subtotal}</p>
            </div>
        `;
        orderListContainer.appendChild(orderItem);
        totalPrices += orderDetails[i].subtotal;
    }
    document.getElementById("totalPrice").innerText = `Total: PHP ${totalPrices}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const correctSelectedOrder = selectedOrder.orderItems.map(item => {
        return {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
            stock: item.stock,
            imageSrc: item.imageSrc
        }
    });
    generateOrderItems(correctSelectedOrder.length, correctSelectedOrder);
    loadFormValues();
});




















// DB SECTION