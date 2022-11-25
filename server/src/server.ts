import "reflect-metadata";
import express from "express";
import cors from "cors";
import { App } from "./app";
import { ErrorMiddleware } from "./middleware/error.middleware";
import { ValidationMiddleware } from "./middleware/validation.middleware";
import logger from "./utils/logger";
import { DelayMiddleware } from "./middleware/delay.middleware";
import { PingEchoController } from "./controllers/ping-echo";
import { ProjectionController } from "./controllers/projections";

const expressApp = express();
expressApp.use(cors());
const port = process.env.PORT || 3001;

// Setup each middleware
const errorMiddleware = new ErrorMiddleware();
const validationMiddleware = new ValidationMiddleware();
const delayMiddleware = new DelayMiddleware();

// Setup each controller
const pingEchoController = new PingEchoController();
const projectionController = new ProjectionController(validationMiddleware);
const app = new App(
    expressApp,
    [
        pingEchoController,
        projectionController,
    ],
    delayMiddleware,
    errorMiddleware,
);

app.setup()
    .then(() => expressApp.listen(port, async () => {
        console.log(
            "  App is running at http://localhost:%d in %s mode",
            port,
            expressApp.get("env")
        );
        console.log("  Press CTRL-C to stop\n");
    }))
    .catch(err => {
        logger.error(`Error starting server! ${err}`);
    });