import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller";
import { ValidationMiddleware } from "../middleware/validation.middleware";
import { IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { API_BASE_URL } from "./config";
import { SavingsProjector } from "../helpers/SavingsProjector";

export class ProjectionController implements Controller {
    public path = `${API_BASE_URL}/projection`;
    public router = Router();
    
    private validationMiddleware: ValidationMiddleware;
    private savingsProjector: SavingsProjector;

    constructor(validationMiddleware: ValidationMiddleware) {
        this.validationMiddleware = validationMiddleware;
        this.savingsProjector = new SavingsProjector();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/savings`,
            this.validationMiddleware.queryValidation(ProjectSavingsRequestDTO),
            this.projectSavings,
        );
    }

    /**
     * Project savings over next 50 years
     */
    public projectSavings = async (req: Request, res: Response): Promise<void> => {
        const params: ProjectSavingsRequestDTO = req.query as any;
        res.send(
            this.savingsProjector.monthlyProjection(
                Number(params.initialDeposit), 
                Number(params.monthlyTopup), 
                Number(params.apr),
            )
        );
    }
}

export class ProjectSavingsRequestDTO {
    @Type(() => Number)
    @IsNumber()
    public initialDeposit: number;

    @Type(() => Number)
    @IsNumber()
    public monthlyTopup: number;

    @Type(() => Number)
    @IsNumber()
    public apr: number;
}