"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_factory_1 = __importDefault(require("./customer.factory"));
const address_1 = __importDefault(require("../value-object/address"));
describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        let customer = customer_factory_1.default.create("John");
        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.Address).toBeUndefined();
    });
    it("should create a customer with an address", () => {
        const address = new address_1.default("Street", 1, "13330-250", "São Paulo");
        let customer = customer_factory_1.default.createWithAddress("John", address);
        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.Address).toBe(address);
    });
});
