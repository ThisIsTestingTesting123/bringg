const db = require('./db.js');
let ordersDB = db.getCollection('orders')
if (!ordersDB) {
    console.log(`No orders collection in DB, initializing a new one.`);
    ordersDB = db.addCollection('orders');
}
/**
 * CRUD for orders in the local in memory storage.
 */
module.exports = {
    getAllOrders: () => {
        return new Promise((resolve, reject) => {
            let allOrders = ordersDB.find({});

            if (allOrders) {
                resolve(allOrders);
            } else {
                reject('No orders found on DB');
            }
        });
    },
    getOrder: (id) => {
        return new Promise((resolve, reject) => {
            let order = ordersDB.findOne({
                id: parseInt(id)
            });

            if (order) {
                resolve(order);
            } else {
                reject(`No order found on DB for order is - ${id}`);
            }
        });
    },
    createOrder: (order) => {
        return new Promise((resolve, reject) => {
            let newOrder = ordersDB.insert(order);

            if (newOrder) {
                resolve(newOrder);
            } else {
                reject(`Unable to insert new order to DB`);
            }
        });
    },
    updateOrder: (id, update_data) => {
        return new Promise((resolve, reject) => {
            let existingOrder = ordersDB.findOne({
                id: parseInt(id)
            });
            let updatedOrder = ordersDB.update(Object.assign(existingOrder, update_data));

            if (updatedOrder) {
                resolve(updatedOrder);
            } else {
                reject(`Unable to update order - ${id}`);
            }
        });
    },
    removeOrder: (id) => {
        return new Promise((resolve, reject) => {
            let existingOrder = ordersDB.findOne({
                id: parseInt(id)
            });

            if (!existingOrder) {
                resolve();
            }

            let removedOrder = ordersDB.remove(existingOrder);

            if (removedOrder) {
                resolve(removedOrder);
            } else {
                reject(`Unable to remove order - ${id}`);
            }
        });
    },
};