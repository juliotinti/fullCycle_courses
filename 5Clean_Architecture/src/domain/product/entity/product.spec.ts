import Product from './product';

describe('Product unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            const prod = new Product('', 'Product 1', 100);
        }).toThrow('product: Id is required');
    });

    it('should throw error when name is empty', () => {
        expect(() => {
            const prod = new Product('123', '', 100);
        }).toThrow('product: Name is required');
    });

    it('should throw error when price is less than zero', () => {
        expect(() => {
            const prod = new Product('123', 'Prod123', -1);
        }).toThrow('product: Price must be greater than zero');
    });

    it('should throw error when name and id is empty', () => {
        expect(() => {
            const prod = new Product('', '', 100);
        }).toThrow('product: Id is required,product: Name is required');
    });

    it('should throw error when name and id is empty, and price is less than zero', () => {
        expect(() => {
            const prod = new Product('', '', -5);
        }).toThrow(
            'product: Id is required,product: Name is required,product: Price must be greater than zero'
        );
    });

    it('should change name', () => {
        const prod = new Product('123', 'Prod123', 100);
        const newName: string = 'prod2';
        prod.changeName(newName);
        expect(prod.name).toBe(newName);
    });

    it('should change price', () => {
        const prod = new Product('123', 'Prod123', 100);
        const expectedPrice: number = 150;
        prod.changePrice(expectedPrice);
        expect(prod.price).toBe(expectedPrice);
    });
});
