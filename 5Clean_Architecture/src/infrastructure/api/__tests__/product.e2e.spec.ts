import { app, sequelize } from '../express';
import request from 'supertest';

describe('E2E test for product', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const productToBeCreated = {
            type: 'a',
            name: 'Product 1',
            price: 10,
        };
        const response = await request(app).post('/product').send({
            type: productToBeCreated.type,
            name: productToBeCreated.name,
            price: productToBeCreated.price,
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(productToBeCreated.name);
        expect(response.body.price).toBe(productToBeCreated.price);
    });

    it('should not create a product', async () => {
        const response = await request(app).post('/product').send({
            price: 100,
        });

        expect(response.status).toBe(500);
    });

    it('should list all products', async () => {
        const productToBeCreated = {
            type: 'a',
            name: 'Product 1',
            price: 10,
        };
        const product2ToBeCreated = {
            type: 'a',
            name: 'Product 2',
            price: 20,
        };
        const response = await request(app).post('/product').send({
            type: productToBeCreated.type,
            name: productToBeCreated.name,
            price: productToBeCreated.price,
        });
        const response2 = await request(app).post('/product').send({
            type: product2ToBeCreated.type,
            name: product2ToBeCreated.name,
            price: product2ToBeCreated.price,
        });

        const listResponse = await request(app).get('/product').send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);
        const product = listResponse.body.products[0];
        expect(product.name).toBe(productToBeCreated.name);
        expect(product.price).toBe(productToBeCreated.price);
        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe(product2ToBeCreated.name);
        expect(product2.price).toBe(product2ToBeCreated.price);
    });
});
