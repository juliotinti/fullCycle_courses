export default class OrderItem {
    private _id: string;
    private _name: string;
    private _productId: string;
    private _price: number;
    private _quantity: number;

    get price(): number {
        return this._price;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get productId(): string {
        return this._productId;
    }

    get quantity(): number {
        return this._quantity;
    }

    constructor(
        id: string,
        name: string,
        price: number,
        productId: string,
        quantity: number
    ) {
        this._id = id;
        this._productId = productId;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
    }

    orderItemTotal(): number {
        return this._price * this._quantity;
    }
}
