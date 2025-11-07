import { Request, Response } from "express"
import Expense from "../models/Expense"
export class ExpenseController {
    static create = async (req: Request, res: Response) => {
        try {
            const expense = new Expense(req.body)
            expense.budgetId = req.budget.id
            await expense.save()
            res.status(201).json("Gasto Creado Correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error de servidor"})
        }
    }
    static getByID = async (req: Request, res: Response) => {
        res.json(req.expense)
    }
    static updateByID = async (req: Request, res: Response) => {
        const {expense} = req
        await expense.update(req.body)
        res.json("Gasto cambiado exitosamente")
    }
    static deleteByID = async (req: Request, res: Response) => {
        const {expense} = req
        await expense.destroy()
        res.json("Gasto eliminado exitosamente")
    }
}