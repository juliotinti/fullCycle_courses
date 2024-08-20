import Customer from '../entities/customer';
import RepositoryInterface from './repository.interface';

export default interface CustomerRepositoryInterface
    extends RepositoryInterface<Customer> {}
