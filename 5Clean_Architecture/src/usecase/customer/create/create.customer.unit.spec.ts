import {
    InputCreateCustomerDto,
    OutputCreateCustomerDto,
} from './create.customer.dto';
import CreateCustomerUseCase from './create.customer.usecase';

const input: InputCreateCustomerDto = {
    name: 'John',
    address: {
        street: 'Street',
        number: 123,
        zip: 'Zip',
        city: 'City',
    },
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe('Unit Test: Create Customer use case', () => {
    it('should create a new customer', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(
            customerRepository
        );

        const output: OutputCreateCustomerDto =
            await customerCreateUseCase.execute(input);
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                city: input.address.city,
                number: input.address.number,
                zip: input.address.zip,
            },
        });
    });

    it('should thrown an error when name is missing', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(
            customerRepository
        );

        input.name = '';
        await expect(customerCreateUseCase.execute(input)).rejects.toThrow(
            'Name is required'
        );
    });

    it('should thrown an error when street is missing', async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(
            customerRepository
        );

        input.address.street = '';
        await expect(customerCreateUseCase.execute(input)).rejects.toThrow(
            'Street is required'
        );
    });
});
