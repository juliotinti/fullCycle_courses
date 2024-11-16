import CustomerFactory from '../../../domain/customer/factory/customer.factory';
import Address from '../../../domain/customer/value-object/address';
import ListCustomerUseCase from './list.customer.usecase';

const customer1 = CustomerFactory.createWithAddress(
    'John Doe',
    new Address('any st', 123, 'zip', 'city')
);

const customer2 = CustomerFactory.createWithAddress(
    'Jann Doe',
    new Address('any st2', 1234, 'zip2', 'city2')
);

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest
            .fn()
            .mockReturnValue(Promise.resolve([customer1, customer2])),
        find: jest.fn(),
        update: jest.fn(),
    };
};

describe('list use case unit test', () => {
    it('should list all customers', async () => {
        const customerRepository = MockRepository();
        const useCase = new ListCustomerUseCase(customerRepository);

        const output = await useCase.execute({});

        expect(output.customers.length).toBe(2);
        expect(output.customers[0].id).toEqual(customer1.id);
        expect(output.customers[0].name).toEqual(customer1.name);
        expect(output.customers[0].address.street).toEqual(
            customer1.address.street
        );

        expect(output.customers[1].id).toEqual(customer2.id);
        expect(output.customers[1].name).toEqual(customer2.name);
        expect(output.customers[1].address.street).toEqual(
            customer2.address.street
        );
    });
});
