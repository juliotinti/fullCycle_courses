import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "./client.entity";
import Product from "./product.entity";

type OrderProps = {
  id?: Id;
  client: Client;
  products: Product[];
  status?: string;
  invoiceId?: string;
};

export default class Order extends BaseEntity {
  private _client: Client;
  private _products: Product[];
  private _status: string;
  private _invoiceId: string;

  constructor(props: OrderProps) {
    super(props.id);
    this._client = props.client;
    this._products = props.products;
    this._status = props.status || "pending";
    this._invoiceId = props.invoiceId || null;
    
  }

  get client(): Client {
    return this._client;
  }

  get products(): Product[] {
    return this._products;
  }

  get invoiceId() {
    return this._invoiceId;
  }

  get status(): string {
    return this._status;
  }

  defineInvoice(invoiceId: string) {
    this._invoiceId = invoiceId;
  }

  approveOrder() {
    this._status = "approved";
  }

  get total(): number {
    return this._products.reduce(
      (total, product) => total + product.salesPrice,
      0
    );
  }
}
