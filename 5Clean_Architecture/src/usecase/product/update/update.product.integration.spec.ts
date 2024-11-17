import { Sequelize } from 'sequelize-typescript';
import ProductFactory from '../../../domain/product/factory/product.factory';
import UpdateProductUseCase from './update.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';
import Product from '../../../domain/product/entity/product';

const product = ProductFactory.create('a', 'product name', 100);

const input = {
    id: product.id,
    name: 'product updated',
    price: 200,
};

describe('Test for product update use case', () => {
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

    it('should update a product', async () => {
        const productRepository = new ProductRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        await productRepository.create(product as Product);

        const output = await useCase.execute(input);

        expect(output).toEqual(input);
    });
});
