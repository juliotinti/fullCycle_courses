import Product from '../../../domain/product/entity/product';
import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';
import { InputListProductDto, OutputListProductDto } from './list.product.dto';

export default class ListProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this.productRepository.findAll();
        return OutputMapper.toOutput(products);
    }
}

class OutputMapper {
    static toOutput(products: Product[]): OutputListProductDto {
        return {
            products: products.map((prod) => ({
                id: prod.id,
                name: prod.name,
                price: prod.price,
            })),
        };
    }
}
