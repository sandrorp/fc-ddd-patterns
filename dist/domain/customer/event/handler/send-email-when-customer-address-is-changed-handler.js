"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendCustomerAddressWhenChangedHandler {
    handle(event) {
        const { id, name, address } = event.eventData;
        const logAddress = `Rua ${address.street}, ${address.number} - CEP: ${address.zip} - ${address.city}`;
        console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${logAddress}`);
    }
}
exports.default = SendCustomerAddressWhenChangedHandler;
