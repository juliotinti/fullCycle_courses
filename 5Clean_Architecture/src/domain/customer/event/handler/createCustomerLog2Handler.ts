import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customerCreated.event";

export class CreateCustomerLog2Handler implements EventHandlerInterface<CustomerCreatedEvent> 
{
	handle(): void {
		console.log(`This is the second event console.log: Customer Created`);
	}
}