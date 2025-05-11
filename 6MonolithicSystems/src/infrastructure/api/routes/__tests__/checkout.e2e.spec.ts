import { Sequelize } from "sequelize-typescript"
import request from 'supertest'
import { Umzug } from "umzug"
import express, { Express } from 'express'
import { migrator } from "../../../../configs/sequelize/config-migrations/migrator"
import { checkoutRoute } from "../checkout.route"
import Address from "../../../../modules/@shared/domain/value-object/address"
import ClientRepository from "../../../../modules/client-adm/repository/client.repository"
import ProductRepository from "../../../../modules/product-adm/repository/product-adm.repository"
import AddClientUseCase from "../../../../modules/client-adm/usecase/add-client/add-client.usecase"
import AddProductUseCase from "../../../../modules/product-adm/usecase/add-product/add-product.usecase"
import ClientModel from "../../../../modules/client-adm/repository/client.model"
import ProductAdmModel from "../../../../modules/product-adm/repository/product-adm.model"
import ProductModel from "../../../../modules/store-catalog/repository/product.model"
import TransactionModel from "../../../../modules/payment/repository/transaction.model"
import InvoiceModel from "../../../../modules/invoice/repository/invoice.model"
import InvoiceItemModel from "../../../../modules/invoice/repository/invoice-item.model"
import OrderModel from "../../../../modules/checkout/repository/order.model"

describe("E2E tests for Checkout", () => {

    const app: Express = express()
    app.use(express.json())
    app.use("/checkout", checkoutRoute)

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([ClientModel, ProductAdmModel, ProductModel,
            TransactionModel, InvoiceModel, InvoiceItemModel, OrderModel]);

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

    it("should create an checkout", async () => {
        const clientRepository = new ClientRepository()
        const addClientUseCase = new AddClientUseCase(clientRepository)

        await addClientUseCase.execute({
            id: "1",
            name: "Client 1",
            email: "w5h9A@example.com",
            document: "12345678901",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888",
            )
        })

        const productRepository = new ProductRepository();
        const addProductUseCase = new AddProductUseCase(productRepository);

        const productInput1 = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            salesPrice: 100,
            purchasePrice: 10,
            stock: 1,
        };

        const productInput2 = {
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            salesPrice: 200,
            purchasePrice: 20,
            stock: 2,
        };

        await addProductUseCase.execute(productInput1)
        await addProductUseCase.execute(productInput2)

        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "1",
                products: [
                    {
                        productId: "1"
                    },
                    {
                        productId: "2"
                    }
                ]
            })

        expect(response.status).toBe(200)
        expect(response.body.id).toBeDefined()
        expect(response.body.invoiceId).toBeDefined()
        expect(response.body.clientId).toBe("1")
        expect(response.body.products[0].productId).toBe("1")
        expect(response.body.products[1].productId).toBe("2")
        expect(response.body.total).toBe(300)
    })
})
