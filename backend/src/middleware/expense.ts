import { Request, Response, NextFunction } from "express";
import Expense from "../models/Expense";
import { param, validationResult, body } from "express-validator";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}
export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId').isInt().withMessage("ID no válido")
        .custom(value => value > 0).withMessage("ID no válido")
        .run(req)
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next()
}
export const validateExpenseExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {expenseId} = req.params 
        const expense = await Expense.findByPk(expenseId)
        if(!expense)
        {
            res.status(404).json("ID no encontrado")
            return
        }
        req.expense = expense
        next()
    } catch (error) {
        res.status(500).json({error: "Hubo un error de servidor"})
        return
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body("name").notEmpty().withMessage("El nombre del gasto no puede ir vacío").run(req)
    await body("amount").isInt().withMessage("Cantidad no válida")
    .custom(value => value > 0).withMessage("La Cantidad debe ser positiva")
    .run(req)
    next()
}

export const belogToBudget = async (req: Request, res: Response, next: NextFunction) => {
    if(req.budget.id !== req.expense.budgetId){
        const error = new Error("Acción no Válida")
        res.status(403).json({error:error.message})
    }
    next()
}