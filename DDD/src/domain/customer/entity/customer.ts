import EventDispatcher from '../../@shared/event/event-dispatcher';
import { EventDispatcherInterface } from '../../@shared/event/event-dispatcher.interface';
import { CustomerChangedAddressEvent } from '../event/customerChangeAddress.event';
import CustomerCreatedEvent from '../event/customerCreated.event';
import { ChangeCustomerEmailHandler } from '../event/handler/changeCustomerEmailHandler';
import { CreateCustomerLog1Handler } from '../event/handler/createCustomerLog1Handler';
import { CreateCustomerLog2Handler } from '../event/handler/createCustomerLog2Handler';
import Address from '../value-object/address';

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;
    eventDispatcher: EventDispatcherInterface = new EventDispatcher();

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
        this.eventDispatcher.register("CustomerCreatedEvent", new CreateCustomerLog1Handler);
        this.eventDispatcher.register("CustomerCreatedEvent", new CreateCustomerLog2Handler);
        this.eventDispatcher.notify(new CustomerCreatedEvent(this.id))
    }

    get name(): string {
        return this._name;
    }

    get id(): string {
        return this._id;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    isActive(): boolean {
        return this._active;
    }

    validate() {
        if (this._name.length === 0) {
            throw new Error('Name is required');
        }
        if (this._id.length === 0) {
            throw new Error('Id is required');
        }
    }

    changeName(name: string) {
        this._name = name;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error('Address is mandatory to activate a customer');
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    set Address(address: Address) {
        this._address = address;
    }

    changeAddress(address: Address): void {
        this._address = address;
        this.eventDispatcher.register("CustomerChangedAddressEvent", new ChangeCustomerEmailHandler)
        this.eventDispatcher.notify(new CustomerChangedAddressEvent(this));
    }
}
