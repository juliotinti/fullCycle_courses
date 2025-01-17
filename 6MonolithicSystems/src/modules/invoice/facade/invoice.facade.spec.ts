import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;
  const factory = InvoiceFacadeFactory.create();

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    await InvoiceModel.create(
      {
        id: "1",
        name: "John",
        document: "document",
        street: "street",
        number: "number",
        complement: "complement",
        city: "city",
        state: "state",
        zipCode: "zipCode",
        items: [
          { id: "it1", name: "product 1", price: 10 },
          { id: "it2", name: "product 2", price: 20 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: "items" }
    );

    await expect(factory.find({ id: "1" })).resolves.toEqual(
      expect.objectContaining({
        id: "1",
        name: "John",
        document: "document",
        address: {
          street: "street",
          number: "number",
          complement: "complement",
          city: "city",
          state: "state",
          zipCode: "zipCode",
        },
        items: expect.arrayContaining([
          expect.objectContaining({ id: "it1", name: "product 1", price: 10 }),
          expect.objectContaining({ id: "it2", name: "product 2", price: 20 }),
        ]),
        total: 30,
      })
    );
  });

  it("should generate an invoice", async () => {
    const input = {
      name: "John",
      document: "document",
      street: "street",
      number: "number",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
      items: [
        { id: "1", name: "product 1", price: 10 },
        { id: "2", name: "product 2", price: 10 },
        { id: "3", name: "product 3", price: 30 },
      ],
    };

    await expect(factory.generate(input)).resolves.toEqual({
      id: expect.any(String),
      ...input,
      total: 50,
    });
  });
});
