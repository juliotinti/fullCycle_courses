import request from 'supertest'
import { Umzug } from "umzug"
import express, { Express } from 'express'
import { Sequelize } from "sequelize-typescript"
import { migrator } from "../../../../configs/sequelize/config-migrations/migrator"
import { productRoute } from '../product.route'
import ProductAdmModel from '../../../../modules/product-adm/repository/product-adm.model'

describe("E2E tests for Products", () => {

  const app: Express = express()
  app.use(express.json())
  app.use("/products", productRoute)

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ProductAdmModel])
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

  it("should create a product", async () => {
    const response = await request(app)
    .post("/products")
    .send({
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10
    })

    expect(response.status).toBe(201)
    
  })

  it("should check stock for a productId", async () => {

    await ProductAdmModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10
    })

    const response = await request(app).get("/products/check-stock/1")

    expect(response.status).toBe(200)
    expect(response.body.productId).toBe("1")
    expect(response.body.stock).toBe(10)
    
  })
})
