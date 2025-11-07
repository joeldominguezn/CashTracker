import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";

const router = Router()

router.use(limiter)

router.post("/create-account",
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("email").isEmail().withMessage("El correo no es válido"),
    body('password').isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    handleInputErrors,
    AuthController.create_account
)
router.post("/login",
    body("email").isEmail().withMessage("El correo no es válido"),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    handleInputErrors,
    AuthController.login_account
)
router.post("/change-password",
    AuthController.change_password
)

router.post("/confirm-account",
    body("token").notEmpty()
    .isLength({min:6,max:6})
    .withMessage("Token no Válido"),
    handleInputErrors,
    AuthController.confirm_account
)

router.post("/forgot-password",
    body("email").isEmail().withMessage("El correo no es válido"),
    handleInputErrors,
    AuthController.forgot_password
)
router.post("/validate-token",
    body("token").notEmpty()
    .isLength({min:6,max:6})
    .withMessage("Token no Válido"),
    handleInputErrors,
    AuthController.validate_token
)

router.post("/reset-password/:token",
    param("token").notEmpty().isLength({min:6,max:6}).withMessage("Token no Válido"),
    body('password').isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    AuthController.reset_password_with_token
)

router.get("/user",
    authenticate,
    AuthController.get_user
)

router.put("/update-password",
    authenticate,
    body('password').notEmpty().withMessage("La contraseña es requerida"),
    body("new_password").isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    handleInputErrors,
    AuthController.update_curr_password
)
router.post("/check-password",
    authenticate,
    body('password').notEmpty().withMessage("La contraseña es requerida"),
    handleInputErrors,
    AuthController.check_password
)

router.put("/user",
    authenticate,
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body('email').isEmail().withMessage("El correo no es válido"),
    handleInputErrors,
    AuthController.updateUser
)

export default router