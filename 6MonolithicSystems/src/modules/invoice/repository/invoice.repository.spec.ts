import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.respository";
import Address from "../../@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice-item.entity";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;
  const sut = new InvoiceRepository();

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
        id: "i1",
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

    const invoice = await sut.find("i1");

    expect(invoice.id.id).toBe("i1");
    // Client
    expect(invoice.name).toBe("John");
    expect(invoice.document).toBe("document");
    // Address
    expect(invoice.address.street).toBe("street");
    expect(invoice.address.number).toBe("number");
    expect(invoice.address.complement).toBe("complement");
    expect(invoice.address.city).toBe("city");
    expect(invoice.address.state).toBe("state");
    expect(invoice.address.zipCode).toBe("zipCode");
    // Items
    expect(invoice.items.length).toBe(2);
    expect(
      invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      }))
    ).toEqual(
      expect.arrayContaining([
        { id: "it1", name: "product 1", price: 10 },
        { id: "it2", name: "product 2", price: 20 },
      ])
    );
    expect(invoice.total).toBe(30);
  });

  it("should save an invoice", async () => {
    const invoice = new Invoice({
      name: "John",
      document: "document",
      address: new Address(
        "street",
        "number",
        "complement",
        "city",
        "state",
        "zipCode"
      ),
      items: [
        new InvoiceItem({ name: "product 1", price: 10 }),
        new InvoiceItem({ name: "product 2", price: 10 }),
        new InvoiceItem({ name: "product 3", price: 30 }),
      ],
    });

    await sut.save(invoice);

    const invoiceDb = await InvoiceModel.findByPk(invoice.id.id, {
      include: "items",
    });

    expect(invoiceDb.toJSON()).toEqual(
      expect.objectContaining({
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: expect.arrayContaining(
          invoice.items.map((item) =>
            expect.objectContaining({
              id: item.id.id,
              name: item.name,
              price: item.price,
            })
          )
        ),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      })
    );
  });
});
