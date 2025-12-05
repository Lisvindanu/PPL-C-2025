/**
 * Order Module Dependencies Configuration
 */

module.exports = (sequelize) => {
  // Repositories
  const SequelizeOrderRepository = require('../infrastructure/repositories/SequelizeOrderRepository');
  const orderRepository = new SequelizeOrderRepository(sequelize);

  // Service Repository (lazy load untuk menghindari circular dependency)
  let serviceRepository = null;
  try {
    const SequelizeServiceRepository = require('../../service/infrastructure/repositories/SequelizeServiceRepository');
    serviceRepository = new SequelizeServiceRepository(sequelize);
  } catch (error) {
    console.warn('Service repository tidak tersedia, CreateOrder akan terbatas');
  }

  // Paket Repository (lazy load)
  let paketRepository = null;
  try {
    const SequelizePaketRepository = require('../../service/infrastructure/repositories/SequelizePaketRepository');
    paketRepository = new SequelizePaketRepository(sequelize);
  } catch (error) {
    console.warn('Paket repository tidak tersedia');
  }

  // Use Cases
  const CreateOrder = require('../application/use-cases/CreateOrder');
  const GetMyOrders = require('../application/use-cases/GetMyOrders');
  const GetIncomingOrders = require('../application/use-cases/GetIncomingOrders');
  const GetOrderById = require('../application/use-cases/GetOrderById');
  const AcceptOrder = require('../application/use-cases/AcceptOrder');
  const StartOrder = require('../application/use-cases/StartOrder');
  const CompleteOrder = require('../application/use-cases/CompleteOrder');
  const CancelOrder = require('../application/use-cases/CancelOrder');

  const createOrderUseCase = new CreateOrder(orderRepository, serviceRepository, paketRepository);
  const getMyOrdersUseCase = new GetMyOrders(orderRepository);
  const getIncomingOrdersUseCase = new GetIncomingOrders(orderRepository);
  const getOrderByIdUseCase = new GetOrderById(orderRepository);
  const acceptOrderUseCase = new AcceptOrder(orderRepository);
  const startOrderUseCase = new StartOrder(orderRepository);
  const completeOrderUseCase = new CompleteOrder(orderRepository);
  const cancelOrderUseCase = new CancelOrder(orderRepository);

  // Controller
  const OrderController = require('../presentation/controllers/OrderController');
  const orderController = new OrderController({
    createOrderUseCase,
    getMyOrdersUseCase,
    getIncomingOrdersUseCase,
    getOrderByIdUseCase,
    acceptOrderUseCase,
    startOrderUseCase,
    completeOrderUseCase,
    cancelOrderUseCase
  });

  return { orderController };
};