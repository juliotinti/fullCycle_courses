import { Sequelize } from "sequelize-typescript"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import InvoiceModel from "../repository/invoice.model"
import InvoiceItemModel from "../repository/invoice-item.model"

describe("Invoice Facade unit test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should generate an invoice", async () => {
        const facade = InvoiceFacadeFactory.create()

        const input = {
            name: "test",
            document: "test",
            street: "test",
            number: "test",
            complement: "test",
            city: "test",
            state: "test",
            zipCode: "test",
            items: [
                {
                    id: "1",
                    name: "test",
                    price: 10
                }
            ]
        }

        await facade.generate(input)

        const invoice = await InvoiceModel.findAll({ include: ["items"] })

        expect(invoice).toBeDefined()
        expect(invoice[0].id).toBeDefined()
        expect(invoice[0].name).toBe(input.name)
        expect(invoice[0].document).toBe(input.document)
        expect(invoice[0].street).toBe(input.street)
        expect(invoice[0].number).toBe(input.number)
        expect(invoice[0].complement).toBe(input.complement)
        expect(invoice[0].city).toBe(input.city)
        expect(invoice[0].state).toBe(input.state)
        expect(invoice[0].zipcode).toBe(input.zipCode)
        expect(invoice[0].items[0].id).toBe(input.items[0].id)
        expect(invoice[0].items[0].name).toBe(input.items[0].name)
        expect(invoice[0].items[0].price).toBe(input.items[0].price)        
    })

    it("should find an invoice", async () => {
        const facade = InvoiceFacadeFactory.create()

        const input = {
            name: "test",
            document: "test",
            street: "test",
            number: "test",
            complement: "test",
            city: "test",
            state: "test",
            zipCode: "test",
            items: [
                {
                    id: "1",
                    name: "test",
                    price: 10
                }
            ]
        }

        await facade.generate(input)

        const results = await InvoiceModel.findAll()
        const idToSearch = results[0].id

        const invoice = await facade.find({ id: idToSearch })

        expect(invoice).toBeDefined()
        expect(invoice.id).toBe(idToSearch)
        expect(invoice.name).toBe(input.name)
        expect(invoice.document).toBe(input.document)
        expect(invoice.address.street).toBe(input.street)
        expect(invoice.address.number).toBe(input.number)
        expect(invoice.address.complement).toBe(input.complement)
        expect(invoice.address.city).toBe(input.city)
        expect(invoice.address.state).toBe(input.state)
        expect(invoice.address.zipCode).toBe(input.zipCode)
        expect(invoice.items[0].id).toBe(input.items[0].id)
        expect(invoice.items[0].name).toBe(input.items[0].name)
        expect(invoice.items[0].price).toBe(input.items[0].price)
    })
})
