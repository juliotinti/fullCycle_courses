import Address from "../../../@shared/domain/value-object/address";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

describe("Find an invoice usecase unit test", () => {
  const invoiceRepository = { find: jest.fn(), save: jest.fn() };
  const useCase = new FindInvoiceUseCase(invoiceRepository);

  it("should find an invoice", async () => {
    // Given an invoice
    // When sending an invoiceId
    // Then we should get an invoice object
    const invoice = new Invoice({
      name: "John",
      document: "document",
      address: new Address(
        "street",
        "1",
        "complement",
        "city",
        "state",
        "zipcode"
      ),
      items: [new InvoiceItem({ name: "Product 1", price: 1 })],
    });
    invoiceRepository.find.mockResolvedValue(invoice);

    await expect(useCase.execute({ id: invoice.id.id })).resolves.toEqual({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
      createdAt: invoice.createdAt,
    });
  });
});
