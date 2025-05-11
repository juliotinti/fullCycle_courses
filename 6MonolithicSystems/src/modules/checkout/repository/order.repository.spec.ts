import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order Repository unit test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add an order", async () => {
        const repository = new OrderRepository();
        const order = new Order({
            id: new Id("1"),
            status: "pending",
            invoiceId: "1i",
            client: new Client({
                id: new Id("1"),
                name: "Client 1",
                email: "a@a.com",
                address: new Address(
                    "Rua 123",
                    "99",
                    "Casa Verde",
                    "Criciúma",
                    "SC",
                    "88888-888"
                )
            }),
            products: [
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Description 1",
                    salesPrice: 100
                }),
                new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "Description 2",
                    salesPrice: 200
                })
            ]
        });

        order.approveOrder();

        await repository.addOrder(order);

        const result = await repository.findOrder(order.id.id);

        expect(result.id.id).toEqual(order.id.id);
        expect(result.status).toEqual(order.status);
        //@ts-expect-error
        expect(result.client._id._id).toEqual(order.client.id.id);
        //@ts-expect-error
        expect(result.client._id._id).toEqual(order.client.id.id);
        //@ts-expect-error
        expect(result.client._name).toEqual(order.client.name);
        //@ts-expect-error
        expect(result.client._email).toEqual(order.client.email);
        //@ts-expect-error
        expect(result.client._address._street).toEqual(order.client.address.street);
        //@ts-expect-error
        expect(result.client._address._number).toEqual(order.client.address.number);
        //@ts-expect-error
        expect(result.client._address._complement).toEqual(order.client.address.complement);
        //@ts-expect-error
        expect(result.client._address._city).toEqual(order.client.address.city);
        //@ts-expect-error
        expect(result.client._address._state).toEqual(order.client.address.state);
        //@ts-expect-error
        expect(result.client._address._zipCode).toEqual(order.client.address.zipCode);
        //@ts-expect-error
        expect(result.products[0]._id._id).toEqual(order.products[0].id.id);
        //@ts-expect-error
        expect(result.products[0]._name).toEqual(order.products[0].name);
        //@ts-expect-error
        expect(result.products[0]._description).toEqual(order.products[0].description);
        //@ts-expect-error
        expect(result.products[0]._salesPrice).toEqual(order.products[0].salesPrice);
        //@ts-expect-error
        expect(result.products[1]._id._id).toEqual(order.products[1].id.id);
        //@ts-expect-error
        expect(result.products[1]._name).toEqual(order.products[1].name);
        //@ts-expect-error
        expect(result.products[1]._description).toEqual(order.products[1].description);
        //@ts-expect-error
        expect(result.products[1]._salesPrice).toEqual(order.products[1].salesPrice);
        //@ts-expect-error
        expect(result.client._name).toEqual(order.client.name);
        //@ts-expect-error
        expect(result.client._email).toEqual(order.client.email);
        //@ts-expect-error
        expect(result.client._address._street).toEqual(order.client.address.street);
        //@ts-expect-error
        expect(result.client._address._number).toEqual(order.client.address.number);
        //@ts-expect-error
        expect(result.client._address._complement).toEqual(order.client.address.complement);
        //@ts-expect-error
        expect(result.client._address._city).toEqual(order.client.address.city);
        //@ts-expect-error
        expect(result.client._address._state).toEqual(order.client.address.state);
        //@ts-expect-error
        expect(result.client._address._zipCode).toEqual(order.client.address.zipCode);
        //@ts-expect-error
        expect(result.products[0]._id._id).toEqual(order.products[0].id.id);
        //@ts-expect-error
        expect(result.products[0]._name).toEqual(order.products[0].name);
        //@ts-expect-error
        expect(result.products[0]._description).toEqual(order.products[0].description);
        //@ts-expect-error
        expect(result.products[0]._salesPrice).toEqual(order.products[0].salesPrice);
        //@ts-expect-error
        expect(result.products[1]._id._id).toEqual(order.products[1].id.id);
        //@ts-expect-error
        expect(result.products[1]._name).toEqual(order.products[1].name);
        //@ts-expect-error
        expect(result.products[1]._description).toEqual(order.products[1].description);
        //@ts-expect-error
        expect(result.products[1]._salesPrice).toEqual(order.products[1].salesPrice);
    })
})