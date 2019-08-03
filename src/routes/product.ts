import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Product } from '../models/product';

export class ProductRouter {

    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    private initRoutes() {
        this.setSaveProductRoute();
    }

    private setSaveProductRoute() {
        this.router.post('/product', (request: Request, response: Response) => {

            const product = new Product(request.body);
            try {
                Product.findOneAndUpdate({ _id: mongoose.Types.ObjectId(product._id) }, product, { upsert: true, runValidators: true }).then(() => {
                    response.status(201).send(product);
                }).catch((error) => {
                    response.status(500).send(error);
                })
            } catch (error) {
                response.status(500).send(error);
            }
        })
    }
}

