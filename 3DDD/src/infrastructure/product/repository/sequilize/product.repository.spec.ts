import { Sequelize } from 'sequelize-typescript';
import ProductRepository from './product.repository';
import ProductModel from './product.model';
import Product from '../../../../domain/product/entity/product';

describe('Product repository test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: '1' } });

        expect(productModel.toJSON()).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        });
    });

    it('should update a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);

        await productRepository.create(product);

        product.changeName('Product 2');
        product.changePrice(150);

        await productRepository.update(product);
        const productModel = await ProductModel.findOne({ where: { id: '1' } });

        expect(productModel.toJSON()).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price,
        });
    });

    it('should find a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);

        await productRepository.create(product);
        const productModel = await ProductModel.findOne({ where: { id: '1' } });

        const foundProduct = await productRepository.find(product.id);

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price,
        });
    });

    it('should find all product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        await productRepository.create(product);
        const product2 = new Product('2', 'Product 2', 200);
        await productRepository.create(product2);
        const product3 = new Product('3', 'Product 3', 200);
        await productRepository.create(product3);

        const foundProducts = await productRepository.findAll();
        const products = [product, product2, product3];

        expect(products).toEqual(foundProducts);
    });
});
