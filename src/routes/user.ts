import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User } from '../models/user';

export class UserRouter {

    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    private initRoutes() {
        this.setCreateUserRoute();
    }

    private setCreateUserRoute() {
        this.router.post('/user', (request: Request, response: Response) => {
            const user = new User(request.body);
            try {
                User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, user, { upsert: true, runValidators: true }).then(() => {
                    response.status(201).send(user);
                }).catch((error) => {
                    response.status(500).send(error);
                })
            } catch (error) {
                response.status(500).send(error);
            }
        })
    }

}