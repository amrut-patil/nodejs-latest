import * as express from 'express';
import { Request, Response } from 'express';
import { CategoryRouter } from './routes/category'
import { MongooseDB } from './db/mongoose';

export class StoreApplication {

    public app;
    public categoryRouter;

    constructor() {
        this.initDB();
        this.initExpress();
        this.initRoutes();
    }

    private initDB() {
        new MongooseDB();
    }

    private initExpress() {

        this.app = express();

        this.app.use(function (req: Request, res: Response, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        this.app.use(express.json());
    }

    private initRoutes() {
        this.categoryRouter = new CategoryRouter();
        this.app.use(this.categoryRouter.router);

        this.app.get('/', (req: Request, res: Response) => {
            console.log("----------  node server get called ----------");
            res.send({ sample: "test" })
        });
    }
}