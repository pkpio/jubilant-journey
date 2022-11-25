import express from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "errorhandler";
import Controller from "./interfaces/controller";
import { ErrorMiddleware } from "./middleware/error.middleware";
import { DelayMiddleware } from "./middleware/delay.middleware";

export class App {
    private expressApp: express.Express;
    private controllers: Array<Controller>;
    private delayMiddleware: DelayMiddleware;
    private errorMiddleware: ErrorMiddleware;

    public constructor(
        expressApp: express.Express,
        controllers: Array<Controller>,
        delayMiddleware: DelayMiddleware,
        errorMiddleware: ErrorMiddleware,
        
    ) {
        this.expressApp = expressApp;
        this.controllers = controllers;
        this.delayMiddleware = delayMiddleware;
        this.errorMiddleware = errorMiddleware;
    }

    /**
     * Setup the express middleware and routes
     */
    public async setup(): Promise<void> {
        // Error Handler. Provides full stack
        this.expressApp.use(errorHandler());

        // Setup built-in middleware
        this.expressApp.use(compression());
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: true }));
        this.expressApp.use(cors());

        // Setup logging middleware
        this.expressApp.use(morgan("combined"));

        // Setup artificial delay middleware
        this.expressApp.use(this.delayMiddleware.addFixedDelay());

        // Primary app routes.
        this.controllers.forEach((controller) => {
            this.expressApp.use("/", controller.router);
        });

        // Setup error handling middleware
        this.expressApp.use(this.errorMiddleware.errorHandler);
    }

}
