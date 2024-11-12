import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import { CustomerChangedAddressEvent } from "../customerChangeAddress.event";

export class ChangeCustomerEmailHandler implements EventHandlerInterface<CustomerChangedAddressEvent> 
{
	handle(event: CustomerChangedAddressEvent): void {
		const { id, name, address } = event.eventData;
		console.log(`Address of customer: [ID: ${id}] ${name} changed to: ${address}`);
	}
}