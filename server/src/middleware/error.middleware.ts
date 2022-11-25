import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import HttpException from "../exceptions/http.exception";

export class ErrorMiddleware {
    public async errorHandler(
        error: HttpException, 
        request: Request, 
        response: Response, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction,
    ): Promise<void> {
        const status = error.status || 500;
        const message = error.message || "Something went wrong";
        logger.error(`Error while processing [${request.method}]: ${request.path}`);
        logger.error(`[body]: ${request.body}`);
        logger.error(`[error]: ${error}`);
        console.log(response);
        response
            .status(status)
            .send({
                message,
                status,
            });
    }
}