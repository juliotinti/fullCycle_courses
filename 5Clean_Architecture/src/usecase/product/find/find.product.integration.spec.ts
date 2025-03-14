import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';
import FindProductUseCase from './find.product.usecase';
import ProductFactory from '../../../domain/product/factory/product.factory';
import Product from '../../../domain/product/entity/product';

describe('Test find product use case', () => {
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

    it('should find a product', async () => {
        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);

        const product = ProductFactory.create('a', 'product1', 100);

        await productRepository.create(product as Product);

        const input = { id: product.id };
        const output = {
            id: product.id,
            name: product.name,
            price: product.price,
        };
        const result = await usecase.execute(input);

        expect(result).toStrictEqual(output);
    });
});
