import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import { PlaceOrderInputDto } from "../usecase/place-order/place-order.dto";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import CheckoutFacade from "./checkout.facade";

describe("Checkout Facade unit test", () => {

    it("should place an order", async () => {
        const clientProps = {
            id: "1c",
            name: "Client 1",
            document: "0000",
            email: "client@email.com",
            address: {
                street: "Street 1",
                number: "123",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "00000-000",
            },
        };

        const mockClientFacade = {
            find: jest.fn().mockResolvedValue(clientProps),
            add: jest.fn(),
        };

        const mockPaymentFacade = {
            process: jest.fn(),
        };

        const mockOrderRepository = {
            addOrder: jest.fn(),
            findOrder: jest.fn(),
        };

        const mockInvoiceFacade = {
            generate: jest.fn().mockResolvedValue({ id: "1i" }),
            find: jest.fn(),
        };

        const placeOrderUseCase = new PlaceOrderUseCase(
            mockClientFacade,
            null,
            null,
            mockPaymentFacade,
            mockInvoiceFacade,
            mockOrderRepository
        );

        const products = {
            "1": new Product({
                id: new Id("1"),
                name: "Product 1",
                description: "Description 1",
                salesPrice: 40,
            }),
            "2": new Product({
                id: new Id("2"),
                name: "Product 2",
                description: "Description 2",
                salesPrice: 30,
            }),
        };

        const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - not return never
            .mockResolvedValue(null);

        const mockGetProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "getProduct")
            //@ts-expect-error - not return never
            .mockImplementation((productId: keyof typeof products) => {
                return products[productId];
            });

        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
            transactionId: "1t",
            orderId: "1o",
            amount: 70,
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date(),
        });


        const facade = new CheckoutFacade({
            placeOrderUsecase: placeOrderUseCase,
        })

        const input: PlaceOrderInputDto = {
            clientId: clientProps.id,
            products: [{ productId: "1" }, { productId: "2" }],
        };

        const output = await facade.process(input)

        expect(output.invoiceId).toEqual("1i");
        expect(output.total).toEqual(70);
        expect(output.products).toStrictEqual([
            { productId: "1" },
            { productId: "2" },
        ]);
    })
})