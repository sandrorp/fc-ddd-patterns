import { Sequelize } from 'sequelize-typescript';
import { Order } from '../../../../domain/checkout/entity/order';
import { OrderItem } from '../../../../domain/checkout/entity/order_item';
import { Customer } from '../../../../domain/customer/entity/customer';
import { Address } from '../../../../domain/customer/value-object/address';
import { Product } from '../../../../domain/product/entity/product';
import { CustomerModel } from '../../../customer/repository/sequelize/customer.model';
import { CustomerRepository } from '../../../customer/repository/sequelize/customer.repository';
import { ProductModel } from '../../../product/repository/sequelize/product.model';
import { ProductRepository } from '../../../product/repository/sequelize/product.repository';
import { OrderItemModel } from './order-item.model';
import { OrderModel } from './order.model';
import { OrderRepository } from './order.repository';

describe('Order Repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a new Order', async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);

    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it('should find an Order', async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);

    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("o1", "Order 1", [orderItem]);
    const orderRepository = new OrderRepository();

    await orderRepository.create(order);

    const foundOrder = await orderRepository.find("o1");

    expect(order).toStrictEqual(foundOrder);
  });

  it('should throw an error when order is not found', () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find('43562');
    }).rejects.toThrow('Order not found');
  });

  it('should find all Orders', async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);

    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2,
    );

    const orderRepository = new OrderRepository();

    const order1 = new Order("o1", "c1", [orderItem]);
    await orderRepository.create(order1);

    const orders = await orderRepository.findAll();

    expect(orders.length).toBe(1);
  });

  it('should update an Order', async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer("c1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();

    const product = new Product("p1", "Product 1", 10);

    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2,
    );
    const orderItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("o1", "c1", [orderItem]);
    const orderRepository = new OrderRepository();

    await orderRepository.create(order);

    order.addItem(orderItem2);

    await orderRepository.update(order);

    const foundOrder = await orderRepository.find("o1");

    expect(foundOrder.total()).toBe(40);
    expect(foundOrder.items.length).toBe(2);
  });
});