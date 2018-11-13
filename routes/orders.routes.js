const express = require('express');
const router = express.Router();
const order = require('../models/order.js');
const bringgService = require('../services/bringgService.js');

/**
 * Basic RESTFULL controller for Orders resource
 */
router.route('/')
  .get((req, res) => {
    order.getAllOrders()
      .then((allOrders) => {
        console.log(`Succesfully got all ${allOrders.length} Orders from DB`);
        res.status(200).json(allOrders);
      })
      .catch((err) => {
        console.error(err);
        return res.status(503).json(`Unable to get all orders`);
      });
  })
  .post((req, res) => {
    if (!req.body) {
      console.error(`Unable to create new order, got null body`);
      return res.status(503).json(`Unable to create new order`);
    }
    return bringgService.createTask(req.body)
      .then((taskCreated) => {
        console.log(`Succesfully created Task - ${taskCreated.task.id}`);
        return Promise.all([bringgService.createCustomer(req.body.customer), taskCreated]);
      })
      .then(([customerCreated, taskCreated]) => {
        console.log(`Succesfully created Customer - ${customerCreated.customer.id}`);
        return order.createOrder(Object.assign(customerCreated.customer, taskCreated.task))
      })
      .then((newOrder) => {
        console.log(`Succesfully created new order - ${JSON.stringify(newOrder)}`);
        return res.status(201).json(`Succesfully created new order - ${newOrder.id}`);
      })
      .catch((err) => {
        console.error(`Unable to create new order, ${err}`);
        return res.status(503).json(`Unable to create new order`);
      });
  });

router.route('/:id')
  .get((req, res) => {
    const orderId = req.params.id;
    if (!orderId) {
      console.error(`Got no orderId`);
      return res.status(503).json(`Unable to get order`);
    }
    return order.getOrder(orderId)
      .then((order) => {
        console.log(`Succesfully got order - ${JSON.stringify(order)}`);
        return res.status(200).json(order);
      })
      .catch((err) => {
        console.error(`Unable to get order - ${orderId}, ${err}`);
        res.status(503).json(`Unable to get order - ${orderId}`);
      });
  })
  .put((req, res) => {
    const orderId = req.params.id;
    if (!orderId || !req.body) {
      console.error(`Got no orderId or order body`);
      return res.status(503).json(`Unable to update order`);
    }
    return order.updateOrder(orderId, req.body)
      .then((order) => {
        console.log(`Succesfully updated order - ${orderId} to ${JSON.stringify(order)}`);
        res.status(200).json(order);
      })
      .catch((err) => {
        console.error(`Unable to update order - ${orderId}, ${err}`);
        return res.status(503).json(`Unable to update order - ${orderId}`);
      });
  })
  .delete((req, res) => {
    const orderId = req.params.id;
    if (!orderId) {
      console.error(`Got no orderId`);
      return res.status(503).json(`Unable to remove order`);
    }
    return order.removeOrder(orderId)
      .then((removedOrder) => {
        if (removedOrder) {
          console.log(`Succesfully removed order - ${orderId}`);
          res.status(200).json(`Succesfully removed order - ${orderId}`);
        } else {
          console.log(`Nothing to remove`);
          res.status(200).json(`Nothing to remove`);
        }
      })
      .catch((err) => {
        console.error(`Unable to remove order - ${orderId}, ${err}`);
        res.status(503).json(`Unable to remove order - ${orderId}`);
      });
  });

module.exports = router;