import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Relationship
   */
  @ManyToOne(type => Customer, customer => customer.id)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(type => OrdersProducts, order => order.order, {
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'order_id' })
  order_products: OrdersProducts[];
}

export default Order;
