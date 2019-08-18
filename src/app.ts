import * as express from 'express';
import { Request, Response } from 'express';
import { CategoryRouter } from './routes/category'
import { MongooseDB } from './db/mongoose';
import { ProductRouter } from './routes/product';
import { UserRouter } from './routes/user';

export class StoreApplication {

    public app;
    public categoryRouter;
    public productRouter;
    public userRouter;
    public ioServer;
    public httpServer;

    public sockets = new Set();

    constructor() {
        this.initDB();
        this.initExpress();
        this.initIO();
        this.initRoutes(this.sockets);
    }

    private initDB() {
        new MongooseDB();
    }

    private initExpress() {

        this.app = express();

        this.app.use(function (req: Request, res: Response, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            next();
        });

        this.app.use(express.json());
    }

    private initIO() {

        this.httpServer = require("http").Server(this.app);
        this.ioServer = require("socket.io")(this.httpServer);

        this.ioServer.on('connection', socket => {

            this.sockets.add(socket);
            console.log(`Socket ${socket.id} added`);

            socket.on('disconnect', () => {
                console.log(`Deleting socket: ${socket.id}`);
                this.sockets.delete(socket);
                console.log(`Remaining sockets: ${this.sockets.size}`);
            });

        });
    }

    private initRoutes(sockets: any) {
        this.categoryRouter = new CategoryRouter(sockets);
        this.app.use(this.categoryRouter.router);

        this.productRouter = new ProductRouter(sockets);
        this.app.use(this.productRouter.router);

        this.userRouter = new UserRouter();
        this.app.use(this.userRouter.router);

        // this.app.get('/', (req: Request, res: Response) => {
        //     console.log("----------  node server get called ----------");
        //     res.send({ sample: "test" })
        // });
    }
}