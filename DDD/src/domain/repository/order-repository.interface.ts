import Order from '../entities/order';
import Product from '../entities/product';
import RepositoryInterface from './repository.interface';

export default interface OrderRepositoryInterface
    extends RepositoryInterface<Order> {}
