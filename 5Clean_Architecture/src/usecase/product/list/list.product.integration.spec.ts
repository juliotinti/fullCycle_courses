import { Sequelize } from 'sequelize-typescript';
import ProductFactory from '../../../domain/product/factory/product.factory';
import ListProductUseCase from './list.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import Product from '../../../domain/product/entity/product';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';

describe('list use case test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should list all products', async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);

        const product1 = ProductFactory.create('a', 'product1', 10);
        await productRepository.create(product1 as Product);
        const product2 = ProductFactory.create('a', 'product2', 10);
        await productRepository.create(product2 as Product);

        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toEqual(product1.id);
        expect(output.products[0].name).toEqual(product1.name);
        expect(output.products[0].price).toEqual(product1.price);

        expect(output.products[1].id).toEqual(product2.id);
        expect(output.products[1].name).toEqual(product2.name);
        expect(output.products[1].price).toEqual(product2.price);
    });
});
