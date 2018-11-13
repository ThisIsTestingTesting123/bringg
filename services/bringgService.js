const rp = require('request-promise');
const CryptoJS = require('crypto-js');
const createCustomerEndpoint = 'https://admin-api.bringg.com/services/89ad4e38/513f6c5a-c244-4aa9-8555-c159e6ec14b8/dc0f037c-678c-4e6c-851f-83e11a46a619/'
const createTaskEndpoint = 'https://admin-api.bringg.com/services/6f15901b/1b23e9da-0b5c-4e3e-8840-83be712ee7eb/be847717-ae4b-4833-9899-c7836c105e98/'
const getOpenTasksEndpoint = 'https://admin-api.bringg.com/services/Qkdi30cw/75c44bf1-aad3-499f-aa30-450ec6d9cf80/5f904ea3-fbcf-4050-a86b-176f07691a94/'
const getTaskEndpoint = 'https://admin-api.bringg.com/services/j4ud7Kea0/f8436648-0292-432d-a80d-60c9efc7604b/065a3277-46d6-46a7-88d6-61fe8ed20b8a/'

module.exports = {
    createCustomer: (customer) => {
        var options = {
            method: 'POST',
            uri: createCustomerEndpoint,
            body: {
                customer
            },
            json: true
        };

        return rp(options);
    },
    createTask: (task) => {
        var options = {
            method: 'POST',
            uri: createTaskEndpoint,
            body: {
                task
            },
            json: true
        };

        return rp(options)
    },
    getPreviousWeekTasks: () => {
        var options = {
            method: 'POST',
            uri: getOpenTasksEndpoint,
            json: true
        };

        return rp(options)
    },
    getCustomer: async (customerId) => {
        var params = JSON.parse('{}');
        params.timestamp = Date.now();
        params.access_token = "ZtWsDxzfTTkGnnsjp8yC";

        var query_params = '';
        for (var key in params) {
            var value = params[key];
            if (query_params.length > 0) {
                query_params += '&';
            }
            query_params += key + '=' + encodeURIComponent(value);
        }

        params.signature = CryptoJS.HmacSHA1(query_params, "V_-es-3JD82YyiNdzot7").toString();

        let options = {
            method: 'GET',
            uri: `https://developer-api.bringg.com/partner_api/customers/${customerId}`,
            body: params,
            json: true,
            headers: {
                'Content-type': 'application/json'
            },
        };

        try {
            return await rp(options);
        } catch (err) {
            console.error(`Unable to find customer for - ${customerId}`);
            return null
        };
    }
};