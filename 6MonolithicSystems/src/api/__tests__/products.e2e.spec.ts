import { app } from '../express';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
import { OrderModel } from '../../modules/checkout/repository/order.model';
import InvoiceModel from '../../modules/invoice/repository/invoice.model';
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';

describe('E2E test for product', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
        });
        sequelize.addModels([
            OrderModel,
            ClientModel,
            InvoiceModel,
            InvoiceItemModel,
            TransactionModel,
            ProductModel,
        ]);
        sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const response = await request(app).post('/products').send({
            id: '1',
            name: 'Shirt',
            description: 'A good shirt',
            stock: 10,
            purchasePrice: 20,
        });

        expect(response.status).toEqual(201);
    });
});
