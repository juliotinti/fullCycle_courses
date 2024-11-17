import { Sequelize } from 'sequelize-typescript';
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from './create.product.dto';
import CreateProductUseCase from './create.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequilize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequilize/product.repository';

const input: InputCreateProductDto = {
    type: 'a',
    name: 'Product 1',
    price: 10,
};

describe('Test create Product use case', () => {
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

    it('should create a new product', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const output: OutputCreateProductDto = await useCase.execute(input);
        expect(output.name).toEqual(input.name);
        expect(output.price).toEqual(input.price);
    });

    it('should thrown an error when name is missing', async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = '';
        await expect(useCase.execute(input)).rejects.toThrow(
            'Name is required'
        );
    });
});
