import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate an invoice usecase unit test", () => {
  const invoiceRepository = { find: jest.fn(), save: jest.fn() };
  const useCase = new GenerateInvoiceUseCase(invoiceRepository);

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
        { id: "2", name: "product 2", price: 20 },
      ],
    };

    await expect(useCase.execute(input)).resolves.toEqual({
      id: expect.any(String),
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      items: input.items,
      total: 30,
    });
  });
});
