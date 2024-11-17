import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from './create.product.dto';
import CreateProductUseCase from './create.product.usecase';

const input: InputCreateProductDto = {
    type: 'a',
    name: 'Product 1',
    price: 10,
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit Test: Create Product use case', () => {
    it('should create a new product', async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const output: OutputCreateProductDto = await useCase.execute(input);
        expect(output.name).toEqual(input.name);
        expect(output.price).toEqual(input.price);
    });

    it('should thrown an error when name is missing', async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductUseCase(productRepository);

        input.name = '';
        await expect(useCase.execute(input)).rejects.toThrow(
            'Name is required'
        );
    });
});
