import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import HttpException from "../exceptions/http.exception";

export class ValidationMiddleware {
    public bodyValidation<T>(
        type: ClassConstructor<T>,
        skipMissingProperties = false,
    ): RequestHandler {
        return (req, res, next) => {
            validate(plainToInstance<T, string>(type, req.body), { skipMissingProperties })
                .then((errors: ValidationError[]) => {
                    if (errors.length > 0) {
                        const message = errors.map(
                            (error: ValidationError) => Object.values(error.constraints)
                        ).join(", ");
                        next(new HttpException(400, message));
                    } else {
                        next();
                    }
                });
        };
    }

    public queryValidation<T>(
        type: any,
        skipMissingProperties = false,
    ): RequestHandler {
        return (req, res, next) => {
            validate(plainToInstance(type, req.query), { skipMissingProperties })
                .then((errors: ValidationError[]) => {
                    if (errors.length > 0) {
                        const message = errors.map(
                            (error: ValidationError) => Object.values(error.constraints)
                        ).join(", ");
                        next(new HttpException(400, message));
                    } else {
                        next();
                    }
                });
        };
    }
}