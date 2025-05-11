import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare status: string;

    @Column({ allowNull: true })
    declare invoiceId: string;

    @Column({ allowNull: false, type: DataType.JSON })
    declare client: Client;

    @Column({ allowNull: false, type: DataType.JSON })
    declare products: Product[];
}