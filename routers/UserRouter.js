import Router from "express"
import UserController from "../controllers/UserController.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"
import FileMiddleware from "../middlewares/FileMiddleware.js"
import { UpdateUserLoginValidation, UpdateUserPasswordValidation } from "../validations/UserValidations.js"

const router = new Router()

router.get("/me", AuthMiddleware, UserController.getMe)
router.get("/:login", UserController.getUser)
router.post("/me", AuthMiddleware, UpdateUserLoginValidation, UserController.updateLogin)
router.patch("/me", AuthMiddleware, FileMiddleware.single("image"), UserController.updateAvatar)
router.put("/me", AuthMiddleware, UpdateUserPasswordValidation, UserController.updatePassword)

export default router