import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateJoinOrderProducts1595088496849
  implements MigrationInterface {
  private tableForeignKeyProduct = new TableForeignKey({
    name: 'FK_OrdersProducts_Product',
    referencedTableName: 'products',
    referencedColumnNames: ['id'],
    columnNames: ['product_id'],
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  private tableForeignKeyOrder = new TableForeignKey({
    name: 'FK_OrdersProducts_Order',
    referencedTableName: 'orders',
    referencedColumnNames: ['id'],
    columnNames: ['order_id'],
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKeys('orders_products', [
      this.tableForeignKeyProduct,
      this.tableForeignKeyOrder,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys('orders_products', [
      this.tableForeignKeyProduct,
      this.tableForeignKeyOrder,
    ]);
  }
}
