"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = __importDefault(require("../../../../domain/checkout/entity/order"));
const order_item_1 = __importDefault(require("../../../../domain/checkout/entity/order_item"));
const order_item_model_1 = __importDefault(require("./order-item.model"));
const order_model_1 = __importDefault(require("./order.model"));
class OrderRepository {
    async create(entity) {
        await order_model_1.default.create({
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
        }, {
            include: [{ model: order_item_model_1.default }],
        });
    }
    async update(entity) {
        const items = await order_item_model_1.default.findAll({
            where: { order_id: entity.id },
        });
        for (const item of items) {
            if (!entity.items.find((e) => e.id === item.id)) {
                await order_item_model_1.default.destroy({ where: { id: item.id } });
            }
        }
        for (const item of entity.items) {
            await order_item_model_1.default.upsert({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            });
        }
        await order_model_1.default.update({
            total: entity.total(),
        }, {
            where: { id: entity.id },
        });
    }
    async find(id) {
        const orderModel = await order_model_1.default.findOne({
            where: { id },
            rejectOnEmpty: true,
            include: [{ model: order_item_model_1.default }],
        });
        const orderItems = orderModel.items.map((item) => {
            const orderItem = new order_item_1.default(item.id, item.name, item.price / item.quantity, item.product_id, item.quantity);
            return orderItem;
        });
        return new order_1.default(orderModel.id, orderModel.customer_id, orderItems);
    }
    async findAll() {
        const orderModels = await order_model_1.default.findAll({
            include: [{ model: order_item_model_1.default }],
        });
        const orders = orderModels.map((orderModel) => {
            const orderItems = orderModel.items.map((item) => {
                return new order_item_1.default(item.id, item.name, item.price / item.quantity, item.product_id, item.quantity);
            });
            return new order_1.default(orderModel.id, orderModel.customer_id, orderItems);
        });
        return orders;
    }
}
exports.default = OrderRepository;
