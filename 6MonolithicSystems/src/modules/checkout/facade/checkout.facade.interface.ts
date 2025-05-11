export interface PlaceOrderFacadeInputDto {
    clientId: string;
    products: {
        productId: string;
    }[];
}

export interface PlaceOrderFacadeOutputDto {
    id: string;
    invoiceId: string;
    total: number;
    products: {
        productId: string;
    }[];
}

export default interface CheckoutFacadeInterface {
    process(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
}
