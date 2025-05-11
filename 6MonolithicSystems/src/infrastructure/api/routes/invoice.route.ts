import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = express.Router()

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
        id: req.params.id
    }

    try {
        const output = await facade.find(input);
        res.status(200).send(output);
    } catch (err) {
        res.status(500).send(err);
    }
})
