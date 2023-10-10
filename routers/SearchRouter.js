import Router from "express"
import SearchController from "../controllers/SearchController.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"

const router = new Router()

router.get("/users/:login", AuthMiddleware, SearchController.user)
router.get("/posts/:title", AuthMiddleware, SearchController.post)
router.get("/cities/:name", AuthMiddleware, SearchController.city)

export default router