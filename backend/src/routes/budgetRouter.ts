import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExist, validateBudgetId, validateBudgetInput, validateUserID } from "../middleware/budget";
import {ExpenseController} from "../controllers/ExpenseController";
import { belogToBudget, validateExpenseExist, validateExpenseId, validateExpenseInput } from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router = Router()
//Configs
router.use(authenticate)
router.param("budgetId",validateBudgetId)
router.param("budgetId",validateBudgetExist)
router.param("budgetId",validateUserID)
router.param("expenseId",validateExpenseId)
router.param("expenseId",validateExpenseExist)
router.param("expenseId",belogToBudget)

//Budget
router.get("/",BudgetController.getAll)
router.get("/:budgetId",BudgetController.getByID)
router.post("/",
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create
)
router.put("/:budgetId",
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateByID
)
router.delete("/:budgetId",BudgetController.deleteByID)

//Expense
router.post("/:budgetId/expenses",
    validateExpenseInput,
    handleInputErrors,
    ExpenseController.create
)
router.get("/:budgetId/expenses/:expenseId",ExpenseController.getByID)
router.put("/:budgetId/expenses/:expenseId",
    validateExpenseInput,
    handleInputErrors,
    ExpenseController.updateByID
)
router.delete("/:budgetId/expenses/:expenseId",ExpenseController.deleteByID)

export default router