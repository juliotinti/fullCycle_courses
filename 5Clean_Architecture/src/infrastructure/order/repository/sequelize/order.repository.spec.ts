import { Sequelize } from 'sequelize-typescript';

import OrderRepository from './order.repository';
import CustomerModel from '../../../customer/repository/sequelize/customer.model';
import OrderModel from './order.model';
import OrderItemModel from './order-item.model';
import ProductModel from '../../../product/repository/sequilize/product.model';
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository';
import Customer from '../../../../domain/customer/entity/customer';
import Address from '../../../../domain/customer/value-object/address';
import ProductRepository from '../../../product/repository/sequilize/product.repository';
import Product from '../../../../domain/product/entity/product';
import OrderItem from '../../../../domain/checkout/entity/orderItem';
import Order from '../../../../domain/checkout/entity/order';

describe('Order repository test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order('123', '123', [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ['items'],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id,
                },
            ],
            total: orderItem.price * orderItem.quantity,
        });
    });

    it('should update an order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order('123', '123', [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const product1 = new Product('124', 'Product 2', 15);
        await productRepository.create(product1);

        const updatedOrderItem = new OrderItem(
            '2',
            product1.name,
            product1.price,
            product1.id,
            3
        );

        order.items.push(updatedOrderItem);
        await orderRepository.update(order);

        const updatedOrderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: [{ model: OrderItemModel, as: 'items' }],
        });

        expect(updatedOrderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id,
                },
                {
                    id: updatedOrderItem.id,
                    name: updatedOrderItem.name,
                    price: updatedOrderItem.price,
                    quantity: updatedOrderItem.quantity,
                    order_id: order.id,
                    product_id: updatedOrderItem.productId,
                },
            ],
            total:
                orderItem.price * orderItem.quantity +
                updatedOrderItem.price * updatedOrderItem.quantity,
        });
    });

    it('should find a order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order('123', '123', [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.id);

        expect(foundOrder).toStrictEqual(order);
    });

    it('should find all orders', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem1 = new OrderItem(
            '1',
            product.name,
            product.price,
            product.id,
            2
        );

        const orderItem2 = new OrderItem(
            '2',
            product.name,
            product.price,
            product.id,
            1
        );

        const order1 = new Order('123', '123', [orderItem1]);
        const order2 = new Order('124', '123', [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order1);
        expect(orders).toContainEqual(order2);
    });
});
