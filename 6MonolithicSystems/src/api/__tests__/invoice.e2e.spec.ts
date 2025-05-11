import { app } from '../express';
import request from 'supertest';

import Id from '../../modules/@shared/domain/value-object/id.value-object';
import InvoiceRepository from '../../modules/invoice/repository/invoice.respository';
import Invoice from '../../modules/invoice/domain/invoice.entity';
import { Product } from '../../modules/invoice/domain/product';
import Address from '../../modules/@shared/domain/value-object/address';
import InvoiceItem from '../../modules/invoice/domain/invoice-item.entity';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
import { OrderModel } from '../../modules/checkout/repository/order.model';
import InvoiceModel from '../../modules/invoice/repository/invoice.model';
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';

describe('E2E test for invoice', () => {
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

    it('should do the invoice', async () => {
        const address = new Address(
            'Main Street',
            '123',
            'Next to the bank',
            'New York',
            'New York',
            '122343404'
        );

        const invoiceItem1 = new InvoiceItem({
            id: new Id('1'),
            name: 'Product 1',
            price: 100,
        });

        const invoiceItem2 = new InvoiceItem({
            id: new Id('2'),
            name: 'Product 2',
            price: 200,
        });

        const invoice = new Invoice({
            id: new Id('123'),
            name: 'Invoice 1',
            document: 'Document 1',
            items: [invoiceItem1, invoiceItem2],
            address: address,
        });

        const invoiceRepository = new InvoiceRepository();

        await invoiceRepository.save(invoice);
        const response = await request(app).get(`/invoice/${123}`);

        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual('Invoice 1');
    });
});
