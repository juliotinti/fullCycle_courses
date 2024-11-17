import ProductFactory from '../../../domain/product/factory/product.factory';
import UpdateProductUseCase from './update.product.usecase';

const product = ProductFactory.create('a', 'product name', 100);

const input = {
    id: product.id,
    name: 'product updated',
    price: 200,
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    };
};

describe('Unit test for product update use case', () => {
    it('should update a product', async () => {
        const productRepository = MockRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        const output = await useCase.execute(input);

        expect(output).toEqual(input);
    });
});
