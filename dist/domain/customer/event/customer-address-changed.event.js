"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomerAddressChangedEvent {
    constructor(eventData) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }
}
exports.default = CustomerAddressChangedEvent;
