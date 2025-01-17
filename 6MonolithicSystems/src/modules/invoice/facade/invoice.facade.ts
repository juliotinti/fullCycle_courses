import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import {
  InvoiceFacadeInterface,
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private findInvoiceUseCase: UseCaseInterface,
    private generateInvoiceUseCase: UseCaseInterface
  ) {}

  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
    return this.findInvoiceUseCase.execute(input);
  }

  generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this.generateInvoiceUseCase.execute(input);
  }
}
