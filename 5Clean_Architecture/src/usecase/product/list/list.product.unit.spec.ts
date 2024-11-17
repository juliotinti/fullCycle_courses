import ProductFactory from '../../../domain/product/factory/product.factory';
import ListProductUseCase from './list.product.usecase';

const product1 = ProductFactory.create('a', 'product1', 10);
const product2 = ProductFactory.create('a', 'product2', 10);

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest
            .fn()
            .mockReturnValue(Promise.resolve([product1, product2])),
        find: jest.fn(),
        update: jest.fn(),
    };
};

describe('list use case unit test', () => {
    it('should list all products', async () => {
        const productRepository = MockRepository();
        const useCase = new ListProductUseCase(productRepository);

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
