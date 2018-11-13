const express = require('express');
const router = express.Router();
const moment = require('moment');
const _ = require('lodash');
const bringgService = require('../services/bringgService.js');

/**
 * Recreates the list of orders(Tasks) placed in the previous week by the customer who phone number is provided.
 */
router.route('/:phoneNumber')
    .get((req, res) => {
        const phoneNumber = req.params.phoneNumber;
        if (!phoneNumber) {
            console.error(`Got no phoneNumber`);
            return res.status(503).json(`Unable to get tasks list for customer, got no phone number`);
        }

        // Getting all previous open tasks
        bringgService.getPreviousWeekTasks()
            .then(async (tasksList) => {
                const myCustomerOpenTasks = [];
                let lastWeekTime = moment().subtract(7, 'days');

                // interate each task to see if the creator is correlate with the provided phone number and that the task was created in the last week.
                for (const task in tasksList) {
                    let customer = await bringgService.getCustomer(tasksList[task].customer_id);
                    let isForMyCustomer = _.get(customer, 'customer.phone') === phoneNumber;
                    if (isForMyCustomer) {
                        let isCreatedLastWeek = lastWeekTime.isBefore(tasksList[task].created_at);
                        console.log(`Task Created at - ${tasksList[task].created_at}, Last Week is - ${lastWeekTime} - So ${isCreatedLastWeek}`);
                        isCreatedLastWeek ? myCustomerOpenTasks.push(tasksList[task]) : null;
                    }
                };

                return res.status(200).json(myCustomerOpenTasks);
            })
            .catch((err) => {
                console.error(`Unable to get tasks list for customer - ${phoneNumber}, ${err}`);
                return res.status(503).json(`Unable to get tasks list for customer`);
            });
    });

module.exports = router;