import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Product } from '../models/product';
import { ApplicationConstants } from '../appConstants';
import { Authentication } from '../middleware/authentication';
import { MongooseErrorHanlding } from '../utils/mongooseErrorHandling';

export class ProductRouter {

    public router = express.Router();

    constructor(private sockets: any) {
        this.initRoutes();
    }

    private initRoutes() {
        this.setGetProductRoute();
        this.setGetProductsRoute();
        this.setSaveProductRoute();
        this.setDeleteProductRoute();
    }

    private setGetProductRoute() {
        this.router.get("/product/:name", Authentication.authenticate, async (request: Request, response: Response) => {
            const product = await Product.findOne({ name: request.params.name });
            response.send(product);
        });
    }

    private setGetProductsRoute() {
        this.router.get("/products", Authentication.authenticate, (request: Request, response: Response) => {
            Product.find(((error, res) => {
                response.send(res);
            }))
        })
    }

    private setSaveProductRoute() {
        this.router.post('/product', Authentication.authenticate, (request: Request, response: Response) => {

            const product = new Product(request.body);
            try {
                Product.findOneAndUpdate({ _id: mongoose.Types.ObjectId(product._id) }, product, { upsert: true, runValidators: true }).then(() => {
                    this.sendRealtimeUpdate(product, request.body._id ? ApplicationConstants.UPDATE : ApplicationConstants.INSERT);
                    response.status(201).send(product);
                }).catch((error) => {
                    response.status(500).send(error);
                })
            } catch (error) {
                response.status(500).send(error);
            }
        })
    }

    private setDeleteProductRoute() {
        this.router.delete('/product/:id', Authentication.authenticate, (request: Request, response: Response) => {

            Product.findByIdAndDelete({ _id: mongoose.Types.ObjectId(request.params.id) }).then((product) => {
                if (product) {
                    this.sendRealtimeUpdate(product, ApplicationConstants.DELETE);
                    response.status(204).send();
                } else {
                    response.status(409).send(MongooseErrorHanlding.getDeleteNoRecordErrorMessage());
                }
            }).catch((error) => {
                response.status(409).send(error);
            })
        })
    }

    private sendRealtimeUpdate(product, operation) {
        for (const s of this.sockets) {
            let t: any = s;
            t.emit('product', {
                data: {
                    operation: operation,
                    product: product
                }
            });
        }
    }

}

