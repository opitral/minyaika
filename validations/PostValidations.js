import { body } from "express-validator"

export const AddPostValidation = [
    body("title", "The title must contain from 10 to 50 characters").isLength({ min: 10, max: 50 }),
    body("description", "The description must contain from 20 to 100 characters").isLength({ min: 20, max: 100 }),
    body("category", "The category must exist").isIn(["електроніка", "прикраси", "спорт"])
]

export const UpdatePostValidation = [
    body("title", "The title must contain from 10 to 50 characters").isLength({ min: 10, max: 50 }),
    body("description").isLength({ min: 20, max: 100 }, "The description must contain from 20 to 100 characters")
]