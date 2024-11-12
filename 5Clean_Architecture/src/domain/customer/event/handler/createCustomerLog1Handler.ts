import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customerCreated.event";

export class CreateCustomerLog1Handler implements EventHandlerInterface<CustomerCreatedEvent> 
{
	handle(): void {
		console.log(`This is the first event console.log: Customer Created`);
	}
}