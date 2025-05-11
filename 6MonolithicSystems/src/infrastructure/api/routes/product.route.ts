import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const facade = ProductAdmFacadeFactory.create();
    try {
        const input = {
            id: req.body?.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            salesPrice: req.body.salesPrice,
            stock: req.body.stock
        };

        await facade.addProduct(input);
        res.status(201).send();
    } catch (err) {
        res.status(500).send({ error: err });
    }
})

productRoute.get("/check-stock/:productId", async (req: Request, res: Response) => {
    const facade = ProductAdmFacadeFactory.create();

    try {
        const input = {
            productId: req.params.productId
        }

        const products = await facade.checkStock(input);

        res.status(200).send(products);
    } catch (err) {
        res.status(500).send({ error: err });
    }
})
