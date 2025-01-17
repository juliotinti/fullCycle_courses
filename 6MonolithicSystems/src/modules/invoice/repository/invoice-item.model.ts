import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({ tableName: "invoice_items", timestamps: false })
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column
  price: number;

  @ForeignKey(() => InvoiceModel)
  @Column({ field: "invoice_id" })
  invoiceId: string;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;
}
