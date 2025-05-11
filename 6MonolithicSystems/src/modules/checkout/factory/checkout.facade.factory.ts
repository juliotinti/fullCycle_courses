import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
    static create(): CheckoutFacadeInterface {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();
        const catalogFacade = StoreCatalogFacadeFactory.create();
        const paymentFacade = PaymentFacadeFactory.create();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const repository = new OrderRepository();

        const placeOrderUsecase = new PlaceOrderUseCase(clientFacade, productFacade, catalogFacade, paymentFacade, invoiceFacade, repository);

        const facade = new CheckoutFacade({ placeOrderUsecase: placeOrderUsecase });

        return facade;
    }
}