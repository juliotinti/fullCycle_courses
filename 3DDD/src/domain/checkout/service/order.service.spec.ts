import Customer from '../../customer/entity/customer';
import Order from '../entity/order';
import OrderItem from '../entity/orderItem';
import OrderService from './order.service';

describe('Order service unit tests', () => {
    it('should place an order', () => {
        const customer = new Customer('c1', 'Customer 1');
        const item1 = new OrderItem('i1', 'Item 1', 10, 'p1', 1);
        const expectedTotal = item1.orderItemTotal();
        const expectedReward = item1.price / 2;

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(expectedReward);
        expect(order.total()).toBe(expectedTotal);
    });

    it('should get total of all orders', () => {
        const item1 = new OrderItem('i1', 'item 1', 100, 'p1', 1);
        const item2 = new OrderItem('i2', 'item 2', 200, 'p2', 2);
        const expectedTotal: number =
            item1.orderItemTotal() + item2.orderItemTotal();

        const order1 = new Order('o1', 'c1', [item1]);
        const order2 = new Order('o2', 'c2', [item2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(expectedTotal);
    });
});
