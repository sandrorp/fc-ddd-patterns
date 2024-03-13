"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_address_changed_event_1 = __importDefault(require("../../customer/event/customer-address-changed.event"));
const customer_created_event_1 = __importDefault(require("../../customer/event/customer-created.event"));
const send_console_log1_when_customer_is_created_handler_1 = __importDefault(require("../../customer/event/handler/send-console-log1-when-customer-is-created-handler"));
const send_console_log2_when_customer_is_created_handler_1 = __importDefault(require("../../customer/event/handler/send-console-log2-when-customer-is-created-handler"));
const send_email_when_customer_address_is_changed_handler_1 = __importDefault(require("../../customer/event/handler/send-email-when-customer-address-is-changed-handler"));
const send_email_when_product_is_created_handler_1 = __importDefault(require("../../product/event/handler/send-email-when-product-is-created.handler"));
const product_created_event_1 = __importDefault(require("../../product/event/product-created.event"));
const event_dispatcher_1 = __importDefault(require("./event-dispatcher"));
describe("Domain events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new event_dispatcher_1.default();
        const eventHandler = new send_email_when_product_is_created_handler_1.default();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });
    it("should unregister an event handler", () => {
        const eventDispatcher = new event_dispatcher_1.default();
        const eventHandler = new send_email_when_product_is_created_handler_1.default();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });
    it("should unregister all event handlers", () => {
        const eventDispatcher = new event_dispatcher_1.default();
        const eventHandler = new send_email_when_product_is_created_handler_1.default();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });
    it("should notify all event handlers", () => {
        const eventDispatcher = new event_dispatcher_1.default();
        const eventHandler = new send_email_when_product_is_created_handler_1.default();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        const productCreatedEvent = new product_created_event_1.default({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });
        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    });
    it("should notify all customer event handlers", () => {
        const eventDispatcher = new event_dispatcher_1.default();
        const enviaConsoleLog1Handler = new send_console_log1_when_customer_is_created_handler_1.default();
        const enviaConsoleLog2Handler = new send_console_log2_when_customer_is_created_handler_1.default();
        const spyEvent1Handler = jest.spyOn(enviaConsoleLog1Handler, "handle");
        const spyEvent2Handler = jest.spyOn(enviaConsoleLog2Handler, "handle");
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(enviaConsoleLog1Handler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(enviaConsoleLog2Handler);
        const customerCreatedEvent = new customer_created_event_1.default({
            id: "123",
            name: "Product 1",
            rewardPoints: 0,
        });
        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEvent1Handler).toHaveBeenCalled();
        expect(spyEvent2Handler).toHaveBeenCalled();
    });
    it("Should notify if Customer address is changed", () => {
        const eventDispatcher = new event_dispatcher_1.default();
        const eventHandler = new send_email_when_customer_address_is_changed_handler_1.default();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
        const customerCreatedEvent = new customer_address_changed_event_1.default({
            id: "123",
            name: "Client 1",
            address: {
                street: "Street 1",
                number: 100,
                zip: "8000000",
                city: "City 1",
            },
        });
        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    });
});
