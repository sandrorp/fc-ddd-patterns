"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const order_1 = __importDefault(require("../../../../domain/checkout/entity/order"));
const order_item_1 = __importDefault(require("../../../../domain/checkout/entity/order_item"));
const customer_1 = __importDefault(require("../../../../domain/customer/entity/customer"));
const address_1 = __importDefault(require("../../../../domain/customer/value-object/address"));
const product_1 = __importDefault(require("../../../../domain/product/entity/product"));
const customer_model_1 = __importDefault(require("../../../customer/repository/sequelize/customer.model"));
const customer_repository_1 = __importDefault(require("../../../customer/repository/sequelize/customer.repository"));
const product_model_1 = __importDefault(require("../../../product/repository/sequelize/product.model"));
const product_repository_1 = __importDefault(require("../../../product/repository/sequelize/product.repository"));
const order_item_model_1 = __importDefault(require("./order-item.model"));
const order_model_1 = __importDefault(require("./order.model"));
const order_repository_1 = __importDefault(require("./order.repository"));
describe("Order repository test", () => {
    let sequelize;
    beforeEach(async () => {
        sequelize = new sequelize_typescript_1.Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([
            customer_model_1.default,
            order_model_1.default,
            order_item_model_1.default,
            product_model_1.default,
        ]);
        await sequelize.sync();
    });
    afterEach(async () => {
        await sequelize.close();
    });
    it("should create a new order", async () => {
        const customerRepository = new customer_repository_1.default();
        const customer = new customer_1.default("123", "Customer 1");
        const address = new address_1.default("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        const productRepository = new product_repository_1.default();
        const product = new product_1.default("123", "Product 1", 10);
        await productRepository.create(product);
        const orderItem = new order_item_1.default("1", product.name, product.price, product.id, 2);
        const order = new order_1.default("123", "123", [orderItem]);
        const orderRepository = new order_repository_1.default();
        await orderRepository.create(order);
        const orderModel = await order_model_1.default.findOne({
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
    it("should update a order", async () => {
        const customerRepository = new customer_repository_1.default();
        const customer = new customer_1.default("123", "Customer 1");
        const address = new address_1.default("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        const productRepository = new product_repository_1.default();
        const product = new product_1.default("123", "Product 1", 10);
        await productRepository.create(product);
        const product2 = new product_1.default("456", "Product 2", 5);
        await productRepository.create(product2);
        const orderItem = new order_item_1.default("1", product.name, product.price, product.id, 2);
        const order = new order_1.default("123", "123", [orderItem]);
        const orderRepository = new order_repository_1.default();
        await orderRepository.create(order);
        const orderItem2 = new order_item_1.default("2", product2.name, product2.price, product2.id, 1);
        order.changeItems([orderItem, orderItem2]);
        await orderRepository.update(order);
        const orderModel = await order_model_1.default.findOne({
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
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: "123",
                    product_id: "456",
                },
            ],
        });
    });
    it("should find a order", async () => {
        const customerRepository = new customer_repository_1.default();
        const customer = new customer_1.default("123", "Customer 1");
        const address = new address_1.default("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        const productRepository = new product_repository_1.default();
        const product = new product_1.default("123", "Product 1", 10);
        await productRepository.create(product);
        const orderItem = new order_item_1.default("1", product.name, product.price, product.id, 2);
        const order = new order_1.default("123", "123", [orderItem]);
        const orderRepository = new order_repository_1.default();
        await orderRepository.create(order);
        const orderResult = await orderRepository.find(order.id);
        expect(order).toStrictEqual(orderResult);
    });
    it("should find all orders", async () => {
        const customerRepository = new customer_repository_1.default();
        const customer = new customer_1.default("123", "Customer 1");
        const address = new address_1.default("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        const customer2 = new customer_1.default("456", "Customer 2");
        const address2 = new address_1.default("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);
        const productRepository = new product_repository_1.default();
        const product = new product_1.default("123", "Product 1", 10);
        await productRepository.create(product);
        const product2 = new product_1.default("456", "Product 2", 5);
        await productRepository.create(product2);
        const orderItem = new order_item_1.default("1", product.name, product.price, product.id, 2);
        const orderItem2 = new order_item_1.default("2", product2.name, product2.price, product2.id, 1);
        const order = new order_1.default("123", "123", [orderItem]);
        const order2 = new order_1.default("456", "456", [orderItem2]);
        const orderRepository = new order_repository_1.default();
        await orderRepository.create(order);
        await orderRepository.create(order2);
        const orders = await orderRepository.findAll();
        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order);
        expect(orders).toContainEqual(order2);
    });
});
