import { Sequelize } from "sequelize-typescript"
import InvoiceRepository from "./invoice.repository"
import InvoiceItem from "../domain/invoice-item.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Invoice from "../domain/invoice.entity"
import Address from "../../@shared/domain/value-object/address"
import InvoiceModel from "./invoice.model"
import InvoiceItemModel from "./invoice-item.model"

describe("Invoice Repository unit test", () => {

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

        const invoiceItem = new InvoiceItem({
            id: new Id("1"),
            name: "Item 1",
            price: 100
        })

        const invoice = new Invoice({
            id: new Id("1"),
            name: "John Doe",
            document: "123456789",
            address: new Address("Street", "123", "Complement", "City", "State", "12345678"),
            items: [invoiceItem],
            createdAt: new Date()
        })

        const repository = new InvoiceRepository()
        await repository.generate(invoice)

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: ["items"] })

        expect(invoiceDb.id).toEqual(invoice.id.id)
        expect(invoiceDb.name).toEqual(invoice.name)
        expect(invoiceDb.document).toEqual(invoice.document)
        expect(invoiceDb.street).toEqual(invoice.address.street)
        expect(invoiceDb.number).toEqual(invoice.address.number)
        expect(invoiceDb.complement).toEqual(invoice.address.complement)
        expect(invoiceDb.city).toEqual(invoice.address.city)
        expect(invoiceDb.state).toEqual(invoice.address.state)
        expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode)
        expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id)
        expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name)
        expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price)
    })

    it("should find an invoice", async () => {

        const invoiceItem = new InvoiceItem({
            id: new Id("1"),
            name: "Item 1",
            price: 100
        })

        const invoice = new Invoice({
            id: new Id("1"),
            name: "John Doe",
            document: "123456789",
            address: new Address("Street", "123", "Complement", "City", "State", "12345678"),
            items: [invoiceItem],
            createdAt: new Date()
        })

        const repository = new InvoiceRepository()
        await repository.generate(invoice)

        const result = await repository.find("1")

        expect(result.id.id).toEqual(invoice.id.id)
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
    })
})