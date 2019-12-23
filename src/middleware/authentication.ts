import { Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import { User } from '../models/user';

export class Authentication {

    public static async authenticate(request: Request | any, response: Response, next: any) {
        try {
            const token = request.header('Authorization').replace('Bearer ', '');
            jwt.verify(token, 'estorekey', async (error, decoded) => {
                if (error) {                   
                    Authentication.deleteToken(token);
                    response.status(401).send({ error: "Please authenticate." });
                } else {
                    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
                    if (!user) {
                        throw new Error('User not found');
                    }

                    request.token = token;
                    request.user = user;
                    next();
                }

            });
        } catch (error) {
            response.status(401).send({ error: "Please authenticate." });
        }
    }

    private static async deleteToken(tok: any){
        let decoded: any = jwt.decode(tok);
        const user: any = await User.findOne({ _id: decoded._id, 'tokens.token': tok });
        if (user) {
            user.tokens = user.tokens.filter((token) => {
                return token.token !== tok;
            })
  
            user.set('confirmpassword', user.password); //virtual fields are not set with findOne
            await user.save();
        }
    }
}