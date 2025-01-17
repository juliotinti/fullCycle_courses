import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceMapper from "../../_mapper/invoice.mapper";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDto,
  FindInvoiceUseCaseOutputDto,
} from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDto
  ): Promise<FindInvoiceUseCaseOutputDto> {
    const invoice = await this.invoiceRepository.find(input.id);
    return InvoiceMapper.toFindOutput(invoice);
  }
}
