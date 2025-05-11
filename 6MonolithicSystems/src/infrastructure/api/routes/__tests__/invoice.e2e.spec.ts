import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'
import { Umzug } from "umzug"
import express, { Express } from 'express'
import { invoiceRoute } from '../invoice.route'
import { migrator } from '../../../../configs/sequelize/config-migrations/migrator'
import InvoiceModel from "../../../../modules/invoice/repository/invoice.model"
import InvoiceItemModel from '../../../../modules/invoice/repository/invoice-item.model'

describe("E2E tests for Invoice", () => {

    const app: Express = express()
    app.use(express.json())
    app.use("/invoice", invoiceRoute)

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        migration = migrator(sequelize)
        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    it("should create an invoice", async () => {
        const items = [
            {
                id: "1",
                name: "Item 1",
                price: 100
            },
            {
                id: "2",
                name: "Item 2",
                price: 200
            }
        ]

        await InvoiceModel.create(
            {
                id: "1",
                name: "Invoice 1",
                document: "123456789",
                street: "Street 1",
                number: "123",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipcode: "12345678",
                items: items,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                include: [{ model: InvoiceItemModel }]
            }
        )

        const response = await request(app)
            .get("/invoice/1")
            .send()

        expect(response.status).toBe(200)
        expect(response.body.name).toBe("Invoice 1")
        expect(response.body.document).toBe("123456789")
        expect(response.body.address.street).toBe("Street 1")
        expect(response.body.address.number).toBe("123")
        expect(response.body.address.complement).toBe("Complement 1")
        expect(response.body.address.city).toBe("City 1")
        expect(response.body.address.state).toBe("State 1")
        expect(response.body.address.zipCode).toBe("12345678")
        expect(response.body.items[0].id).toBe("1")
        expect(response.body.items[0].name).toBe("Item 1")
        expect(response.body.items[0].price).toBe(100)
        expect(response.body.items[1].id).toBe("2")
        expect(response.body.items[1].name).toBe("Item 2")
        expect(response.body.items[1].price).toBe(200)
    })
})