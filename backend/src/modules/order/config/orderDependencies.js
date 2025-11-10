/**
 * Order Module Dependencies Configuration
 */

module.exports = (sequelize) => {
  const SequelizeOrderRepository = require('../infrastructure/repositories/SequelizeOrderRepository');
  const GetIncomingOrders = require('../application/use-cases/GetIncomingOrders');
  const OrderController = require('../presentation/controllers/OrderController');

  const orderRepository = new SequelizeOrderRepository(sequelize);

  const getIncomingOrdersUseCase = new GetIncomingOrders(orderRepository);

  const orderController = new OrderController({
    getIncomingOrdersUseCase,
  });

  return { orderController };
};