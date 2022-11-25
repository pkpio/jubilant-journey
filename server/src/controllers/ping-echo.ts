import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller";
import { API_BASE_URL } from "./config";

export class PingEchoController implements Controller {
    public path = API_BASE_URL;
    public router = Router(); 

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(`${this.path}/ping`, this.ping);
        this.router.all(`${this.path}/echo`, this.echo);
    }

    /**
     * A simple ping endpoint to check service liveliness
     */
    public async ping(req: Request, res: Response): Promise<void> {
        res.send({ message: "Hello there!"});
    }

    /**
     * A simple echo endpoint to debug requests
     */
    public async echo(req: Request, res: Response): Promise<void> {
        res.send({ 
            message: "I echo what I get",
            echo: {
                "headers": req.headers,
                "query": req.query,
                "body": req.body,
            }
        });
    }

}