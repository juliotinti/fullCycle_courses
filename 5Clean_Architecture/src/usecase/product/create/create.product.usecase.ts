import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';
import {
    InputCreateProductDto,
    OutputCreateProductDto,
} from './create.product.dto';
import ProductFactory from '../../../domain/product/factory/product.factory';
import ProductInterface from '../../../domain/product/entity/product.interface';
import Product from '../../../domain/product/entity/product';

export default class CreateProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(
        input: InputCreateProductDto
    ): Promise<OutputCreateProductDto> {
        const product: ProductInterface = ProductFactory.create(
            input.type,
            input.name,
            input.price
        );

        await this.productRepository.create(product as Product);
        return {
            id: product.id,
            name: product.name,
            price: product.price,
        };
    }
}
