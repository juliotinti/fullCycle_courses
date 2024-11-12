import Order from './order';
import OrderItem from './orderItem';

describe('Order unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            const order = new Order('', '123', []);
        }).toThrow('Id is required');
    });

    it('should throw error when customerId is empty', () => {
        expect(() => {
            const order = new Order('123', '', []);
        }).toThrow('CustomerId is required');
    });

    it('should throw error when items is empty', () => {
        expect(() => {
            const order = new Order('123', '123', []);
        }).toThrow('Item qty must be greater than 0');
    });

    it('should calculate total', () => {
        const item = new OrderItem('i1', 'Item 1', 100, 'p1', 2);
        const item2 = new OrderItem('i2', 'Item 2', 200, 'p2', 2);
        const expectedTotal =
            item.price * item.quantity + item2.price * item2.quantity;
        const order = new Order('o1', 'customer1', [item, item2]);

        const total = order.total();
        expect(total).toBe(expectedTotal);
    });

    it('should throw error if the item qty is greater than zero', () => {
        expect(() => {
            const item = new OrderItem('i1', 'Item 1', 100, 'p1', 0);
            const order = new Order('o1', 'customer1', [item]);
        }).toThrow('Quantity must be greater than zero');
    });
});
