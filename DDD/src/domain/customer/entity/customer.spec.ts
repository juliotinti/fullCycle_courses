import EventDispatcher from "../../@shared/event/event-dispatcher";
import { ChangeCustomerEmailHandler } from "../event/handler/changeCustomerEmailHandler";
import { CreateCustomerLog1Handler } from "../event/handler/createCustomerLog1Handler";
import { CreateCustomerLog2Handler } from "../event/handler/createCustomerLog2Handler";
import Address from "../value-object/address";
import Customer from "./customer";

jest.mock("../../@shared/event/event-dispatcher");

describe("Customer unit tests", () => {

  it("should register createCustomerEvent when customer created", () => {
    const customer = new Customer("1", "John");

    expect(customer.eventDispatcher.register).toHaveBeenCalledWith(
      "CustomerCreatedEvent",
      expect.any(CreateCustomerLog1Handler)
    );
    expect(customer.eventDispatcher.register).toHaveBeenCalledWith(
      "CustomerCreatedEvent",
      expect.any(CreateCustomerLog2Handler)
    );
  });

  it("should register customerChangeAddress when customer changes address", () => {
    const customer = new Customer("1", "John");
    const address = new Address("Street 1", 123, "12341-123", "Alfenas");
    customer.changeAddress(address);

    expect(customer.eventDispatcher.register).toHaveBeenCalledWith(
      "CustomerChangedAddressEvent",
      new ChangeCustomerEmailHandler()
    );
  });

  it("should throw error when id is empty", () => {
    expect(() => {
      const customer = new Customer("", "John");
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      const customer = new Customer("123", "");
    }).toThrow("Name is required");
  });

  it("should change name", () => {
    const customer = new Customer("123", "John");
    customer.changeName("Jane");

    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "John");
    const address = new Address("Street 1", 123, "12341-123", "Alfenas");

    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "John");
    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should throw error when addres is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "John");
      customer.activate();
      expect(customer.isActive()).toBe(true);
    }).toThrow("Address is mandatory to activate a customer");
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "customer 1");
    expect(customer.rewardPoints).toBe(0);
    const rewardPoints = 10;
    customer.addRewardPoints(rewardPoints);
    expect(customer.rewardPoints).toBe(rewardPoints);

    customer.addRewardPoints(rewardPoints * 2);
    expect(customer.rewardPoints).toBe(rewardPoints * 3);
  });
});
