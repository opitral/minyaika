import Router from "express"
import CityController from "../controllers/CityController.js"

const router = new Router()

router.get("/areas", CityController.areas)
router.get("/areas/:name", CityController.cities)

export default router