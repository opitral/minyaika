import { body } from "express-validator"

export const RegistrationValidation = [
    body("login", "The login must contain from 6 to 12 characters and only letters and lower dash").isLength({ min: 6, max: 12}).matches(/^[a-z0-9_]+$/),
    body("email", "Enter a valid email address").isEmail(),
    body("password", "The password must contain from 6 to 16 characters and can only contain Latin letters, numbers, and special characters such as @").isLength({ min: 8, max: 16 }).matches(/^[\w!@#$%^&*]+$/)
]

export const LoginValidation = [
    body("email", "Enter a valid email address").isEmail(),
    body("password")
]

export const RecoveryValidation = [
    body("email", "Enter a valid email address").isEmail()
]

export const SubmitValidation = [
    body("password", "The password must contain from 6 to 16 characters and can only contain Latin letters, numbers, and special characters such as @").isLength({ min: 8, max: 16 }).matches(/^[\w!@#$%^&*]+$/)
]