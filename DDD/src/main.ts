import Address from './entities/address';
import Customer from './entities/customer'
import Order from './entities/order';
import OrderItem from './entities/orderItem';

let customer = new Customer("123", "Julio");
const address = new Address("Rua", 2, "12345-123", "SP")
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "item1", 10);
const item2 = new OrderItem("2", "item2", 15);

const order = new Order("1", "123", [item1, item2])