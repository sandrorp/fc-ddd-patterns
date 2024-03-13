"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_factory_1 = __importDefault(require("./product.factory"));
describe("Product factory unit test", () => {
    it("should create a proct type a", () => {
        const product = product_factory_1.default.create("a", "Product A", 1);
        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product A");
        expect(product.price).toBe(1);
        expect(product.constructor.name).toBe("Product");
    });
    it("should create a proct type b", () => {
        const product = product_factory_1.default.create("b", "Product B", 1);
        expect(product.id).toBeDefined();
        expect(product.name).toBe("Product B");
        expect(product.price).toBe(2);
        expect(product.constructor.name).toBe("ProductB");
    });
    it("should throw an error when product type is not supported", () => {
        expect(() => product_factory_1.default.create("c", "Product C", 1)).toThrowError("Product type not supported");
    });
});
