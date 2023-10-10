import UserModel from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { validationResult } from "express-validator"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config({ path: new URL("../.env", import.meta.url) })
const SMTP_SERVICE = process.env.SMTP_SERVICE
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const JWT_SECRET = process.env.JWT_SECRET || "secret"

const transporter = nodemailer.createTransport({
    service: SMTP_SERVICE,
    auth: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        user: SMTP_USER,
        pass: SMTP_PASS,
        secure: true
    }
})

class AuthController {
    async signin(req, res) {
        try {
            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }

            const user = await UserModel.findOne({ email: req.body.email })

            if (!user) {
                return res.status(401).json({
                    message: "Authorization data is incorrect"
                })
            }

            const password = await bcrypt.compare(req.body.password, user.password)

            if (!password) {
                return res.status(401).json({
                    message: "Authorization data is incorrect"
                })
            }

            if (!user.verification.status) {
                return res.status(403).json({
                    message: "You have not verified your email address"
                })
            }

            const token = jwt.sign({"id": user._id}, JWT_SECRET)

            return res.json({
                token: token
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during login to account"
            })
        }
    }

    async signup(req, res) {
        try {
            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }

            const email = await UserModel.findOne({ email: req.body.email })
    
            if (email) {
                return res.status(401).json({
                    message: "The email address is already taken"
                })
            }

            const login = await UserModel.findOne({ login: req.body.login })

            if (login) {
                return res.status(401).json({
                    message: "The login is already taken"
                })
            }

            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)

            const token = crypto.randomBytes(16).toString('hex')

            await UserModel.create({
                login: req.body.login,
                email: req.body.email,
                password: password,
                verification: {
                    status: false,
                    token: token
                },
                online: Math.floor(new Date().getTime() / 1000)
            })

            await transporter.sendMail({
                from: {
                    name: "Міняйка",
                    address: SMTP_USER
                },
                to: req.body.email,
                subject: "Підтвердження електронної пошти",
                text: `Для підтвердження електронної адреси, перейдіть за посиланням http://localhost:4444/api/auth/confirm/${token}`,
                html: `Для підтвердження електронної адреси, перейдіть за посиланням <strong>http://localhost:4444/api/auth/confirm/${token}</strong>`
            })

            return res.json({
                message: "Confirm your email address"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during account registration"
            })
        }
    }

    async confirmAccount(req, res) {
        try {
            const token = req.params.token

            const user = await UserModel.findOneAndUpdate(
                { "verification.token": token },
                { "verification.status": true, "verification.token": null },
                { new: true }
            )
            
            if (user) {
                const token = jwt.sign({"id": user._id}, JWT_SECRET)

                return res.json({
                    token: token
                })

            } else {
                return res.status(404).json({
                    message: "Token not found"
                })
            }

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during email address verification"
            })
        }
    }

    async recoveryPassword (req, res) {
        try {
            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }
    
            const user = await UserModel.findOne({email: req.body.email})
    
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
    
            if (!user.verification.status) {
                return res.status(403).json({
                    message: "You have not verified your email address"
                })
            }
    
            const token = crypto.randomBytes(16).toString('hex')
            user.recovery.token = token
            user.recovery.expiration = Math.floor(new Date().getTime() / 1000 + 3600)
            await user.save()
    
            await transporter.sendMail({
                from: {
                    name: "Міняйка",
                    address: SMTP_USER
                },
                to: user.email,
                subject: "Відновлення пороля",
                text: `Для відновлення пароля, перейдіть за посиланням http://localhost:4444/api/auth/recovery/${token}, воно діє одну годину`,
                html: `Для відновлення пароля, перейдіть за посиланням <strong>http://localhost:4444/api/auth/confirm?recovery/${token}</strong>, воно діє одну годину`
            })

            return res.json({
                message: "The reset link has been sent to your email"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during password recovery"
            })
        }
    }

    async changePassword (req, res) {
        try {
            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }
    
            const token = req.params.token
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
    
            const user = await UserModel.findOne({"recovery.token": token})

            if (!user) {
                return res.status(404).json({
                    message: "Token not found"
                })
            }

            if (user.recovery.expiration < Math.floor(new Date().getTime() / 1000)) {
                return res.status(400).json({
                    message: "Token time is up"
                })
            }
    
            user.password = password
            user.recovery.token = null
            user.recovery.expiration = null
            await user.save()

            return res.json({
                message: "Password changed"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during password recovery"
            })
        }
    }
}

export default new AuthController()