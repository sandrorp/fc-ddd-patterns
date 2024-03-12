import { Order } from '../../../../domain/checkout/entity/order';
import { OrderItem } from '../../../../domain/checkout/entity/order_item';
import { OrderRepositoryInterface } from '../../../../domain/checkout/repository/order-repository.interface'
import { OrderItemModel } from './order-item.model';
import { OrderModel } from './order.model';

export class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customer_id,
        total: entity.total(),
        items: entity.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_id: item.product_id,
        })),
      },
      { include: [{ model: OrderItemModel }] },
    );
  }

  async update(entity: Order): Promise<void> {
    // atualiza os itens do pedido
    const ordemItems = entity.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.product_id,
      quantity: item.quantity,
      order_id: entity.id,
    }));

    // remove os itens existentes
    await OrderItemModel.destroy({
      where: { order_id: entity.id },
    });

    // cria os itens atualizados
    await OrderItemModel.bulkCreate(ordemItems);

    // atualiza o total do pedido
    await OrderModel.update(
      { total: entity.total() },
      { where: { id: entity.id } },
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        rejectOnEmpty: true,
        include: ['items'],
      });
    } catch (error) {
      throw new Error('Order not found');
    }

    const items = orderModel.items.map(item => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity,
      );
    });

    const order = new Order(id, orderModel.customer_id, items);

    return order;
  }

  async findAll(): Promise<Order[]> {
    let orderModel;
    try {
      orderModel = await OrderModel.findAll({
        include: ['items'],
      });
    } catch (error) {
      throw new Error('Order not found');
    }

    const orders = orderModel.map(order => {
      const items = order.items.map(item => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        );
      });

      return new Order(order.id, order.customer_id, items);
    });

    return orders;
  }
}

