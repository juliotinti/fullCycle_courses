import Address from '../../modules/@shared/domain/value-object/address';
import Client from '../../modules/client-adm/domain/client.entity';
import { AddClientFacadeInputDto } from '../../modules/client-adm/facade/client-adm.facade.interface';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import ClientRepository from '../../modules/client-adm/repository/client.repository';
import { app } from '../express';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
import { OrderModel } from '../../modules/checkout/repository/order.model';
import InvoiceModel from '../../modules/invoice/repository/invoice.model';
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';

const address = new Address(
    'Main Street',
    '123',
    'Next to the bank',
    'New York',
    'New York',
    '122343404'
);

describe('E2E test for client', () => {
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

    it('should create a client', async () => {
        const response = await request(app).post('/clients').send({
            id: '1',
            name: 'john doe',
            email: 'john.doe@email.com',
            document: '215251',
            address: address,
        });

        expect(response.status).toEqual(201);
    });

    it('should not create a client when name is not provided', async () => {
        const response = await request(app).post('/clients').send({
            id: '1',
            email: 'john.doe@email.com',
            document: '215251',
            address: address,
        });

        expect(response.status).toEqual(400);
    });
});
