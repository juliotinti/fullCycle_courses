import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../../domain/invoice-item.entity"
import Invoice from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"


const invoice = new Invoice({
    id: new Id('1'),
    name: 'John Doe',
    document: '123456789',
    address: new Address("Street", "123", "Complement", "City", "State", "12345678"),
    items: [
        new InvoiceItem({
            name: 'Item 1',
            price: 100
        }),
        new InvoiceItem({
            name: 'Item 2',
            price: 200
        })
    ],
})

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        generate: jest.fn(),
    }
}

describe('Find Invoice Use Case', () => {

    it('should find an invoice', async () => {
        const repository = MockRepository()
        const usecase = new FindInvoiceUseCase(repository)

        const input = {
            id: '1'
        }

        const result = await usecase.execute(input) 

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toEqual(invoice.id.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address.street).toEqual(invoice.address.street)
        expect(result.address.number).toEqual(invoice.address.number)
        expect(result.address.complement).toEqual(invoice.address.complement)
        expect(result.address.city).toEqual(invoice.address.city)
        expect(result.address.state).toEqual(invoice.address.state)
        expect(result.address.zipCode).toEqual(invoice.address.zipCode)
        expect(result.items[0].name).toEqual(invoice.items[0].name)
        expect(result.items[0].price).toEqual(invoice.items[0].price)
        expect(result.items[1].name).toEqual(invoice.items[1].name)
        expect(result.items[1].price).toEqual(invoice.items[1].price)
        expect(result.total).toEqual(invoice.items.reduce((total, item) => total + item.price, 0))
    })
})