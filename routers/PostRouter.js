import Router from "express"
import PostController from "../controllers/PostController.js"
import AuthMiddleware from "../middlewares/AuthMiddleware.js"
import FileMiddleware from "../middlewares/FileMiddleware.js"
import { AddPostValidation, UpdatePostValidation } from "../validations/PostValidations.js"

const router = new Router()

router.get("/", AuthMiddleware, PostController.getPosts)
router.get("/:id", AuthMiddleware, PostController.getOnePost)
router.post("/", AuthMiddleware, FileMiddleware.array("images", 6), AddPostValidation, PostController.addPost)
router.delete("/:id", AuthMiddleware, PostController.deletePost)
router.put("/:id", AuthMiddleware, UpdatePostValidation, FileMiddleware.array("images", 6), PostController.updatePost)
router.patch("/:id", AuthMiddleware, PostController.addPostToFavotites)

export default router