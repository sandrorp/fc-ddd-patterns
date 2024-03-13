import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendCustomerAddressWhenChangedHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    const { id, name, address } = event.eventData;
    const logAddress = `Rua ${address.street}, ${address.number} - CEP: ${address.zip} - ${address.city}`;
    console.log(
      `Endereço do cliente: ${id}, ${name} alterado para: ${logAddress}`
    );
  }
}
