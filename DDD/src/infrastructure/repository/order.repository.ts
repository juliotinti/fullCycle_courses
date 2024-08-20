import Order from '../../domain/entities/order';
import OrderItem from '../../domain/entities/orderItem';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';
import { UpdateOptions } from 'sequelize';

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                total: entity.total(),
            },
            {
                where: { id: entity.id },
            }
        );

        for (const item of entity.items) {
            await OrderItemModel.upsert({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            });
        }
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: {
                id,
            },
            rejectOnEmpty: true,
            include: [{ model: OrderItemModel }],
        });
        const order = new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(
                (item) =>
                    new OrderItem(
                        item.id,
                        item.name,
                        item.price,
                        item.product_id,
                        item.quantity
                    )
            )
        );
        return order;
    }

    async findAll(): Promise<Order[]> {
        return await OrderModel.findAll({
            include: [{ model: OrderItemModel }],
        }).then((orderModels) => {
            return orderModels.map((orderModel) => {
                return new Order(
                    orderModel.id,
                    orderModel.customer_id,
                    orderModel.items.map(
                        (item) =>
                            new OrderItem(
                                item.id,
                                item.name,
                                item.price,
                                item.product_id,
                                item.quantity
                            )
                    )
                );
            });
        });
    }
}
