import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User } from '../models/user';
import { request } from 'https';
import { Authentication } from '../middleware/authentication';
import { MongooseErrorHanlding } from '../utils/mongooseErrorHandling';

export class UserRouter {

    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    private initRoutes() {
        this.setCreateUserRoute();
        this.setLoginRoute();
        this.setLogoutRoute();
    }

    private setCreateUserRoute() {
        this.router.post('/user', (request: Request, response: Response) => {

            const user = new User(request.body);
            try {
                user.save().then(() => {
                    response.status(201).send(user);
                }).catch((error) =>
                    response.status(500).send(error)
                );
            } catch (error) {
                response.status(500).send(error);
            }
        })
    }

    private setLoginRoute() {
        this.router.post('/login', async (request: Request, response: Response) => {
            try {
                const user = await User.schema.statics.findByCredentials(request.body.email, request.body.password);
                const token = await user.generateAuthenticationToken();
                response.send({ user, token });
            } catch (error) {
                response.status(400).send(MongooseErrorHanlding.getBuiltErrorMessage(error.message));
            }
        })
    }

    private setLogoutRoute() {
        this.router.post('/logout', Authentication.authenticate, async (request: Request | any, response: Response) => {
            try {
                request.user.tokens = request.user.tokens.filter((token) => {
                    return token.token !== request.token;
                })

                request.user.set('confirmpassword', request.user.password); //virtual fields are not set with findOne
                await request.user.save();
                response.send();
            } catch (error) {
                response.status(500).send(MongooseErrorHanlding.getBuiltErrorMessage(error.message));
            }
        })
    }

}