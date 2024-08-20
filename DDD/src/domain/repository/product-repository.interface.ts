import Product from '../entities/product';
import RepositoryInterface from './repository.interface';

export default interface ProductRepositoryInterface
    extends RepositoryInterface<Product> {}
