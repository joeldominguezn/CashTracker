import { createRequest, createResponse} from "node-mocks-http"
import { BudgetController } from "../../controllers/BudgetController"
import Budget from "../../models/Budget"
import { budgets } from "../mocks/budgets"

jest.mock("../../models/Budget", () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
}))

describe("Budget - getAll",() => {
    beforeEach(()=>{
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options)=>{
            const updatedBudget = budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(updatedBudget)
        })
    })
    it("should retrieve 2 budgets to user with ID 1",async () => {
        const req = createRequest({
            method:"GET",
            url:"/api/budgets",
            user: {id:1}
        })
        const res = createResponse();

        await BudgetController.getAll(req,res)
        const data = res._getJSONData()
        expect(data).toHaveLength(2)
        expect(res.statusCode).not.toBe(404)
    })
    it("should retrieve 1 budget to user with ID 2",async () => {
        const req = createRequest({
            method:"GET",
            url:"/api/budgets",
            user: {id:2}
        })
        const res = createResponse();
        await BudgetController.getAll(req,res)
        const data = res._getJSONData()
        expect(data).toHaveLength(1)
        expect(res.statusCode).not.toBe(404)
    })
    it("should retrieve 0 budget to user with ID 500",async () => {
        const req = createRequest({
            method:"GET",
            url:"/api/budgets",
            user: {id:500}
        })
        const res = createResponse();
        await BudgetController.getAll(req,res)
        const data = res._getJSONData()
        expect(data).toHaveLength(0)
        expect(res.statusCode).not.toBe(404)
    })
    it("should handle Errors",async () => {
        const req = createRequest({
            method:"GET",
            url:"/api/budgets",
            user: {id:500}
        })
        const res = createResponse();
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error);
        await BudgetController.getAll(req,res);
        expect(res.statusCode).toBe(500)
    })
})

describe("Budget - create", () => {
    it("should create a new budget - statusCode 201", async () => {
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };
        (Budget.create as jest.Mock).mockResolvedValue(mockBudget);
        const req = createRequest({
            method:"POST",
            url:"/api/budgets",
            user: {id:1},
            body: {
                name: "Presupuesto test",
                amount: 1000
            }
        });
        const res = createResponse();

        await BudgetController.create(req,res);
        expect(res.statusCode).toBe(201)
    })
    it("should not create a new budget - statusCode 500", async () => {
        (Budget.create as jest.Mock).mockRejectedValue(new Error);
        const req = createRequest({
            method:"POST",
            url:"/api/budgets",
            user: {id:1},
            body: {
                name: "Presupuesto test",
                amount: 1000
            }
        });
        const res = createResponse();
        await BudgetController.create(req,res);
        expect(res.statusCode).toBe(500)
    })
})

describe("Budget - find by id", () => {
    beforeEach(() => {
        (Budget.findByPk as jest.Mock).mockImplementation(id => {
            const budget = budgets.filter(b => b.id === id)[0]
            return Promise.resolve(budget)
        })
    })
    it("should retrieve budget id 1 with 3 expenses", async () => {
        const req = createRequest({
            method:"GET",
            url:"/api/budgets/:id",
            budget: {
                id: 1
            }
        });
        const res = createResponse();
        await BudgetController.getByID(req,res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(3);
    })
})