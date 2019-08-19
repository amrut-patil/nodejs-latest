import { Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import { User } from '../models/user';

export class Authentication {

    public static async authenticate(request: Request | any, response: Response, next: any) {
        try {
            const token = request.header('Authorization').replace('Bearer ', '');
            const decoded: any = jwt.verify(token, 'estorekey');
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});
            if (!user) {
                throw new Error('User not found');
            }

            request.token = token;
            request.user = user;
            next();

        } catch (error) {
            console.log(error);
            response.status(401).send({ error: "Please authenticate." });
        }

    }
}