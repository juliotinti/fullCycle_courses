import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import UpdateCustomerUseCase from './update.customer.usecase';

const customer = CustomerFactory.createWithAddress(
    'John Doe',
    new Address('any st', 123, 'zip', 'city')
);

const input = {
    id: customer.id,
    name: 'John Doe updated',
    address: {
        street: 'any st updated',
        number: 1234,
        zip: 'zip updated',
        city: 'city updated',
    },
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    };
};

describe('Unit test for customer update use case', () => {
    it('should update a customer', async () => {
        const customerRepository = MockRepository();
        const customerUpdateUseCase = new UpdateCustomerUseCase(
            customerRepository
        );

        const output = await customerUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    });
});
