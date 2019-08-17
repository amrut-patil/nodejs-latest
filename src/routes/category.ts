import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Category } from '../models/category';
import { ApplicationConstants } from '../appConstants';

export class CategoryRouter {

    public router = express.Router();

    constructor(private sockets: any) {
        this.initRoutes();
    }

    private initRoutes() {
        this.setGetCategoryRoute();
        this.setGetCategoriesRoute();
        this.setGetFilteredCategoriesRoute();
        this.setSaveCategoryRoute();
        this.setDeleteCategoryRoute();
    }

    private setGetCategoryRoute() {
        this.router.get("/category/:name", async (request: Request, response: Response) => {
            const category = await Category.findOne({ name: request.params.name });
            response.send(category);
        });
    }

    private setGetCategoriesRoute() {
        this.router.get("/categories", (request: Request, response: Response) => {
            Category.find(((error, res) => {
                response.send(res);
            }))
        })
    }

    private setGetFilteredCategoriesRoute() {
        this.router.get("/categories/:name", (request: Request, response: Response) => {
            Category.find({ name: { $regex: '.*' + request.params.name + '.*' } }, ((error, res) => {
                response.send(res);
            }))
        })
    }

    private setSaveCategoryRoute() {
        this.router.post("/category", async (request: Request, response: Response) => {

            let parentPath = "";
            if (request.body.parent) {
                let parentCategory: any = await Category.findOne({ name: request.body.parent });
                if (parentCategory)
                    parentPath = parentCategory.path;
            }

            const category = new Category(request.body);
            category.path = parentPath + '/' + category.name;
            try {
                Category.findOneAndUpdate({ _id: mongoose.Types.ObjectId(category._id) }, category, { upsert: true, runValidators: true }).then(() => {
                    this.sendRealtimeUpdate(category, request.body._id ? ApplicationConstants.UPDATE : ApplicationConstants.INSERT);
                    response.status(201).send(category);
                }).catch((error) => {
                    response.status(500).send(error);
                })

            } catch (error) {
                response.status(500).send(error);
            }
        });
    }

    private setDeleteCategoryRoute() {
        this.router.delete("/category/:id", (request: Request, response: Response) => {
            Category.findByIdAndDelete({ _id: mongoose.Types.ObjectId(request.params.id) }).then((category) => {
                this.sendRealtimeUpdate(category, ApplicationConstants.DELETE);
                response.status(204).send();
            }).catch((error) => {
                response.status(409).send(error);
            })
        });
    }

    private sendRealtimeUpdate(category, operation) {
        for (const s of this.sockets) {
            let t: any = s;
            t.emit('category', {
                data: {
                    operation: operation,
                    category: category
                }
            });
        }
    }

}