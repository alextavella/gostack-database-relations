import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError("Customer don't exist.");
    }

    const productIds = products.map(p => ({ id: p.id }));
    const productList = await this.productsRepository.findAllById(productIds);

    if (productList.length !== products.length) {
      throw new AppError('Any product does not exist on database.');
    }

    productList.forEach(product => {
      const inStock = product.quantity;

      const productOrder = products.find(p => p.id === product.id) as Product;
      const productAmount = productOrder?.quantity ?? 0;

      if (productAmount > inStock) {
        throw new AppError(
          `Product ${product.id} has only ${inStock} units in stock.`,
        );
      }
    });

    const createOrder = {
      customer,
      products: products.map(p => ({
        product_id: p.id,
        price: productList.find(pr => pr.id === p.id)?.price,
        quantity: p.quantity,
      })),
    } as ICreateOrderDTO;

    const order = await this.ordersRepository.create(createOrder);

    const updateProducts = products.map(product => {
      const quantityInStock =
        productList.find(pr => pr.id === product.id)?.quantity ?? 0;

      return {
        id: product.id,
        quantity: quantityInStock - product.quantity,
      };
    });

    await this.productsRepository.updateQuantity(updateProducts);

    return order;
  }
}

export default CreateOrderService;
