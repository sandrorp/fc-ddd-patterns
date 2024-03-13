import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const items = await OrderItemModel.findAll({
      where: { order_id: entity.id },
    });

    for (const item of items) {
      if (!entity.items.find((e) => e.id === item.id)) {
        await OrderItemModel.destroy({ where: { id: item.id } });
      }
    }

    for (const item of entity.items) {
      await OrderItemModel.upsert({
      id: item.id,
      name: item.name,
      price: item.price,
        product_id: item.productId,
      quantity: item.quantity,
      order_id: entity.id,
    });
    }

    await OrderModel.update(
      {
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      include: [{ model: OrderItemModel }],
      });

    const orderItems = orderModel.items.map((item) => {
      const orderItem = new OrderItem(
        item.id,
        item.name,
        item.price / item.quantity,
        item.product_id,
        item.quantity
      );

      return orderItem;
    });

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
      });

    const orders = orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map((item): OrderItem => {
        return new OrderItem(
          item.id,
          item.name,
          item.price / item.quantity,
          item.product_id,
          item.quantity
        );
      });

      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });

    return orders;
  }
}

