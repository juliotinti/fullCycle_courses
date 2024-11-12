import EventInterface from "../../@shared/event/event.interface";
import Customer from "../entity/customer";

export class CustomerChangedAddressEvent implements EventInterface 
{
  dataTimeOccured: Date;
  eventData: Customer;

  constructor(eventPayload: Customer)
  {
    this.dataTimeOccured = new Date();
    this.eventData = eventPayload;
  }

}
