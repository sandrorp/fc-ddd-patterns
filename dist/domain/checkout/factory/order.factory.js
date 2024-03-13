"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = __importDefault(require("../entity/order"));
const order_item_1 = __importDefault(require("../entity/order_item"));
class OrderFactory {
    static create(props) {
        const items = props.items.map((item) => {
            return new order_item_1.default(item.id, item.name, item.price, item.productId, item.quantity);
        });
        return new order_1.default(props.id, props.customerId, items);
    }
}
exports.default = OrderFactory;
