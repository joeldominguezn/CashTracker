import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetId').isInt().withMessage("ID no válido")
        .custom(value => value > 0).withMessage("ID no válido")
        .run(req)
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next()
}

export const validateBudgetExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {budgetId} = req.params 
        const budget = await Budget.findByPk(budgetId)
        if(!budget)
        {
            res.status(404).json("ID no encontrado")
            return
        }
        req.budget = budget
        next()
    } catch (error) {
        res.status(500).json({error: "Hubo un error de servidor"})
        return
    }
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
    await body("name").notEmpty().withMessage("El nombre del presupuesto no puede ir vacío").run(req)
    await body("amount").isInt().withMessage("Cantidad no válida")
    .custom(value => value > 0).withMessage("La Cantidad debe ser positiva")
    .run(req)
    next()
}

export const validateUserID = async (req: Request, res: Response, next: NextFunction) => {
    if(req.budget.userId !== req.user.id)
    {
        const error = new Error("Este presupuesto no ha sido encontrado en tu cuenta")
        res.status(401).json({error:error.message})
        return
    }
    next()
}