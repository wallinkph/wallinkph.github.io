export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("db", 1);
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // cartItems
            // minDate
            // pendingOrders
            // newStocks
            // cartItems
            // totalPrice
            // selectedOrder

            if (!db.objectStoreNames.contains("cartItems")) db.createObjectStore("cartItems", { keyPath: "referenceNumber" });
            if (!db.objectStoreNames.contains("minDate")) db.createObjectStore("minDate", { keyPath: "referenceNumber" });
            if (!db.objectStoreNames.contains("pendingOrders")) db.createObjectStore("pendingOrders", { keyPath: "referenceNumber" });
            if (!db.objectStoreNames.contains("newStocks")) db.createObjectStore("newStocks", { keyPath: "referenceNumber" });
            if (!db.objectStoreNames.contains("totalPrice")) db.createObjectStore("totalPrice", { keyPath: "referenceNumber" });
            if (!db.objectStoreNames.contains("selectedOrder")) db.createObjectStore("selectedOrder", { keyPath: "referenceNumber" });
            console.log("Database setup complete.");
        };
    });
};

export function addData(db, table, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.add(data);
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

export function getData(db, table, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readonly");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.get(id);
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

export function getAllData(db, table) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readonly");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.getAll();
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

export function updateData(db, table, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.put(data);
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

export function deleteData(db, table, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.delete(id);
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

export function clearData(db, table) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.clear();
        request.onerror = (event) => {
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

export function closeDB(db) {
    db.close();
}