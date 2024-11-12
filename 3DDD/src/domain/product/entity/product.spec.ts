import Product from "./product";


describe("Product unit tests", () => {
    
    it("should throw error when id is empty", () => {
        expect(() => {
            const prod = new Product("", "Product 1", 100);
        }).toThrow("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            const prod = new Product("123", "", 100);
        }).toThrow("Name is required");
    });

    it("should throw error when price is less than zero", () => {
        expect(() => {
            const prod = new Product("123", "Prod123", -1);
        }).toThrow("Price must be greater than zero");
    });

    it("should change name", () => {
        const prod = new Product("123", "Prod123", 100);
        const newName: string = "prod2";
        prod.changeName(newName);
        expect(prod.name).toBe(newName);
    });

    
    it("should change price", () => {
        const prod = new Product("123", "Prod123", 100);
        const expectedPrice: number = 150;
        prod.changePrice(expectedPrice);
        expect(prod.price).toBe(expectedPrice);
    });

});