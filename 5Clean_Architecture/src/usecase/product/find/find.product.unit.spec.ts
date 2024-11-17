import Product from '../../../domain/product/entity/product';
import FindProductUseCase from './find.product.usecase';

const product = new Product('123', 'Prod 1', 10);
const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};
describe('Unit test find product use case', () => {
    it('should find a product', async () => {
        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        await productRepository.create(product);

        const input = { id: '123' };
        const output = {
            id: product.id,
            name: product.name,
            price: product.price,
        };
        const result = await usecase.execute(input);

        expect(result).toStrictEqual(output);
    });

    it('should throw an error if product not found', async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error('Product not found');
        });
        const usecase = new FindProductUseCase(productRepository);

        expect(() => {
            return usecase.execute({ id: '123' });
        }).rejects.toThrow('Product not found');
    });
});
