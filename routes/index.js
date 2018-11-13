const ordersRoutes = require('./orders.routes');
const customersRoutes = require('./customers.routes');

/**
 * main server entry point
 */
module.exports = (app) => {
  app.use('/api/orders', ordersRoutes);
  app.use('/api/customers', customersRoutes);
};
