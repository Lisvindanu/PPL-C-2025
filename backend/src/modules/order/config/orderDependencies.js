/**
 * Order Module Dependencies Configuration
 */

module.exports = (sequelize) => {
  const SequelizeOrderRepository = require('../infrastructure/repositories/SequelizeOrderRepository');
  const GetIncomingOrders = require('../application/use-cases/GetIncomingOrders');
  const GetOrderById = require('../application/use-cases/GetOrderById');
  const OrderController = require('../presentation/controllers/OrderController');

  const orderRepository = new SequelizeOrderRepository(sequelize);

  const getIncomingOrdersUseCase = new GetIncomingOrders(orderRepository);
  const getOrderByIdUseCase = new GetOrderById(orderRepository);

  const orderController = new OrderController({
    getIncomingOrdersUseCase,
    getOrderByIdUseCase,
  });

  return { orderController };
};