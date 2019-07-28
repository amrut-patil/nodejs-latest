import * as express from 'express';
import { Request, Response } from 'express';
import { Category } from '../models/category';

export class CategoryRouter {

    public router = express.Router();

    constructor() {

        this.router.get("/category", (request: Request, response: Response) => {
            response.send({ category: "category get respone" });
        });

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
                category.save().then(() => {
                    response.status(201).send({ message: "Success" });
                }).catch((error) => {
                    response.status(201).send({ message: "Error" });
                })

            } catch (error) {
                response.status(400).send(error);
            }

        });

        this.router.get("/categories", (request: Request, response: Response) => {

            Category.find(((error, res) => {
                response.send(res);
            }))
        })

    }
}