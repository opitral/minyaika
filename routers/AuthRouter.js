import Router from "express"
import AuthController from "../controllers/AuthController.js"
import { LoginValidation, RegistrationValidation, RecoveryValidation, SubmitValidation } from "../validations/AuthValidations.js"

const router = new Router()

router.post("/signin", LoginValidation, AuthController.signin)
router.post("/signup", RegistrationValidation, AuthController.signup)
router.get("/confirm/:token", AuthController.confirmAccount)
router.post("/recovery", RecoveryValidation, AuthController.recoveryPassword)
router.post("/recovery/:token", SubmitValidation, AuthController.changePassword)


export default router