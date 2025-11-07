import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
} 

export const validateUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await param("token").notEmpty().isLength({min:6,max:6}).withMessage("Token no Válido").run(req)
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return
        }
        next() 
    } catch (error) {
        res.status(500).json({error: "Hubo un error de servidor"})
        return
    }
}