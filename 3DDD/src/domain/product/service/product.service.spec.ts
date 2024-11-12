import Product from '../entity/product';
import ProductService from './product.service';

describe('Product service unit tests', () => {
    it('should change the prices of all products', () => {
        const percentage: number = 100;
        const product1 = new Product('product1', 'Product 1', 10);
        const product1ExpectedPrice = product1.price * (1 + percentage / 100);
        const product2 = new Product('product2', 'Product 2', 20);
        const product2ExpectedPrice = product2.price * (1 + percentage / 100);

        ProductService.increasePrice([product1, product2], percentage);

        expect(product1.price).toBe(product1ExpectedPrice);
        expect(product2.price).toBe(product2ExpectedPrice);
    });
});
