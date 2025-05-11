import request from 'supertest'
import { Umzug } from "umzug"
import express, { Express } from 'express'
import { Sequelize } from "sequelize-typescript"
import { migrator } from "../../../../configs/sequelize/config-migrations/migrator"
import { clientRoute } from "../client.route"
import ClientModel from "../../../../modules/client-adm/repository/client.model"

describe("E2E tests for Client", () => {

  const app: Express = express()
  app.use(express.json())
  app.use("/clients", clientRoute)

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ClientModel])
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

  it("should create a client", async () => {

    const response = await request(app)
    .post("/clients").send({
      name: "DDD",
      email: "JtZp0@example.com",
      document: "12345678901",
      address: {
        street: "Street 1",
        number: 123,
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345678",
      },
    })

    expect(response.status).toBe(201)
  })

  it("should find a client", async () => {

    const props = {
      id: "1",
      name: "DDD",
      email: "JtZp0@example.com",
      document: "12345678901",
      street: "Street 1",
      number: 123,
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipcode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await ClientModel.create(props)

    const response = await request(app).get("/clients/1")

    expect(response.status).toBe(200)
    expect(response.body.name).toBe("DDD")
    expect(response.body.email).toBe("JtZp0@example.com")
    expect(response.body.document).toBe("12345678901")
    expect(response.body.address._street).toBe("Street 1")
    expect(response.body.address._number).toBe("123")
    expect(response.body.address._complement).toBe("Complement 1")
    expect(response.body.address._city).toBe("City 1")
    expect(response.body.address._state).toBe("State 1")
    expect(response.body.address._zipCode).toBe("12345678")
  })
})
