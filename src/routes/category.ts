import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Category } from '../models/category';

export class CategoryRouter {

    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    private initRoutes() {
        this.setGetCategoryRoute();
        this.setSaveCategoryRoute();
        this.setGetCategoriesRoute();
        this.setGetFilteredCategoriesRoute();
    }

    private setGetCategoryRoute() {
        this.router.get("/category/:name", async (request: Request, response: Response) => {
            const category = await Category.findOne({ name: request.params.name });
            response.send(category);
        });
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
                    response.status(201).send(category);
                }).catch((error) => {
                    response.status(500).send(error);
                })

            } catch (error) {
                response.status(500).send(error);
            }
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
            Category.find({name: { $regex: '.*' + request.params.name + '.*' } }, ((error, res) => {
                response.send(res);
            }))
        })
    }
}