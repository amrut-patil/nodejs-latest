import * as express from 'express';
import { Request, Response } from 'express';
import { Category } from '../models/category';

export class CategoryRouter {

    public router = express.Router();

    constructor() {

        this.router.get("/category", (req: Request, res: Response) => {

            console.log("---------- category get called ----------");
            res.send({ category: "category get respone" });
        })

        this.router.post("/category", (req: Request, res: Response) => {

            console.log("---------- category post called ----------");
            console.log(req.body);

            const category = new Category(req.body);
            try {
                category.save().then(() => {
                    res.status(201).send({ message: "Success" });
                }).catch((error) => {
                    res.status(201).send({ message: "Error" });
                })

            } catch (error) {
                res.status(400).send(error);
            }

        })
    }
}