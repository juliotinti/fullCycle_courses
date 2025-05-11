import { app } from '../express';
import request from 'supertest';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
import { Sequelize } from 'sequelize-typescript';
import { migrator } from '../config-migrations/migrator';
import { Umzug } from 'umzug';
import { OrderModel } from '../../modules/checkout/repository/order.model';
import express, { Express } from 'express';
import { checkoutRoute } from '../routes/checkout.route';

describe('E2E test for checkout', () => {
    let sequelize: Sequelize;
    let migration: Umzug<any>;
    const app: Express = express();
    app.use(express.json());
    app.use('/checkout', checkoutRoute);

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        });
        await sequelize.addModels([ClientModel, ProductModel, OrderModel]);

        migration = migrator(sequelize);
        await migration.up();
    });

    afterEach(async () => {
        if (!migration || !sequelize) {
            return;
        }
        await migration.down();
        await sequelize.close();
    });

    it('should do the checkout', async () => {
        await ClientModel.create({
            id: '1',
            name: 'Client 1',
            email: 'client@example.com',
            street: 'Address 1',
            number: '123',
            city: 'any city',
            state: 'any state',
            zipcode: '00000-000',
            document: '0000',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await ProductModel.create({
            id: '1',
            name: 'My Product',
            description: 'Product description',
            purchasePrice: 100,
            salesPrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await ProductModel.create({
            id: '2',
            name: 'My Product 2',
            description: 'Product description',
            purchasePrice: 25,
            salesPrice: 25,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await request(app)
            .post('/checkout')
            .send({
                clientId: '1',
                products: [{ productId: '1' }, { productId: '2' }],
            });

        expect(response.status).toEqual(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.total).toEqual(125);
        expect(response.body.status).toEqual('approved');
    });
});
