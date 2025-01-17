import Invoice from "../domain/invoice.entity";
import { FindInvoiceUseCaseOutputDto } from "../usecase/find-invoice/find-invoice.dto";
import { GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.dto";

export default class InvoiceMapper {
  static toFindOutput(invoice: Invoice): FindInvoiceUseCaseOutputDto {
    return {
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
    };
  }

  static toGenerateOutput(invoice: Invoice): GenerateInvoiceUseCaseOutputDto {
    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
    };
  }
}
