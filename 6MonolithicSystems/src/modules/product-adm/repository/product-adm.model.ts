import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  modelName: 'product-adm-table',
  tableName: 'products',
  timestamps: false
})
export default class ProductAdmModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: true })
  declare purchasePrice: number;

  @Column({ allowNull: true })
  declare salesPrice: number;

  @Column({ allowNull: true })
  declare stock: number;

  @Column({ allowNull: true })
  declare createdAt: Date;

  @Column({ allowNull: true })
  declare updatedAt: Date;
}
