import { Request, Response } from "express"
import Budget from "../models/Budget"
import Expense from "../models/Expense"

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findAll({
                order: [
                    ['createdAt','ASC']
                ],
                where: {
                    userId: req.user.id
                }
            })
            res.json(budget)
            return
        } catch (error) {
            res.status(500).json({error: "Hubo un error de servidor"})
            return
        }
    }
    static getByID = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        })
        res.json(budget)
    }
    static create = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.create(req.body)
            budget.userId = req.user.id
            await budget.save()
            res.status(201).json("Presupuesto Creado Correctamente")
        } catch (error) {
            res.status(500).json({error: "Hubo un error de servidor"})
        }
    }
    static updateByID = async (req: Request, res: Response) => {
        const {budget} = req
        await budget.update(req.body)
        res.json("Presupuesto cambiado exitosamente")
    }
    static deleteByID = async (req: Request, res: Response) => {
        const {budget} = req
        await budget.destroy()
        res.json("Presupuesto eliminado exitosamente")
    }
}