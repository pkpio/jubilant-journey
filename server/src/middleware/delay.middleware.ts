import { RequestHandler } from "express";
import { delay } from "../utils/util";

/**
 * Middleware just to add artificial delays to requests. Potentially useful to simulate 
 * slow networks or repeal certain types of attacks
 */
export class DelayMiddleware {
    
    public addFixedDelay(delayMs: number = 1500): RequestHandler {
        return (req, res, next) => {
            delay(delayMs).then(() => next());
        };
    }

    public addRandomDelay(minDelayMs: number = 100, maxDelayMs: number = 500): RequestHandler {
        return (req, res, next) => {
            const delayMs = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1) + maxDelayMs);
            delay(delayMs).then(() => next());
        };
    }
}