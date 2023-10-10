import { body } from "express-validator"

export const UpdateUserLoginValidation = [
    body("login", "The login must contain from 6 to 12 characters and only letters and lower dash").isLength({ min: 6, max: 12}).matches(/^[a-z0-9_]+$/)
]

export const UpdateUserPasswordValidation = [
    body("oldPassword", "Enter your account password"),
    body("newPassword", "The password must be from 8 to 16 characters and can contain only Latin letters, numbers, or some special characters such as @, #, $, %, ^, &, +, =, !, _.").isLength({ min: 8, max: 16 }).matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&+=!_]*$/)
]