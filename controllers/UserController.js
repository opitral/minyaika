import UserModel from "../models/UserModel.js"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"

class UserController {
    async getUser (req, res) {
        try {
            const user = await UserModel.findOne({ login: req.params.login })

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }

            let status

            if ((Math.floor(new Date().getTime() / 1000) - user.online) > 300) {
                status = false
            } else {
                status = true
            }

            return res.json({
                id: user._id,
                login: user.login,
                avatar: user.avatar,
                online: {
                    status: status,
                    last: user.online
                },
                posts: user.posts
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error while receiving a user"
            })
        }
    }

    async getMe (req, res) {
        try {
            if (!req.UserId) {
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }

            const user = await UserModel.findOne({ _id: req.UserId })

            let status

            if ((Math.floor(new Date().getTime() / 1000) - user.online) > 300) {
                status = false
            } else {
                status = true
            }

            return res.json({
                id: user._id,
                login: user.login,
                avatar: user.avatar,
                online: {
                    status: status,
                    last: user.online
                },
                posts: user.posts,
                favorites: user.favorites,
                trades: user.trades
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error while receiving a user"
            })
        }
    }

    async updateLogin (req, res) {
        try {
            if (!req.UserId) {
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }

            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }

            const login = await UserModel.findOne({ login: req.body.login })

            if (login) {
                return res.status(401).json({
                    message: "The login is already taken"
                })
            }

            const user = await UserModel.findOne({ _id: req.UserId })

            user.login = req.body.login
            await user.save()

            return res.json({
                message: "User updated"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during user login update"
            })
        }
    }

    async updateAvatar (req, res) {
        try {
            if (!req.UserId) {
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }

            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }

            const user = await UserModel.findOne({ _id: req.UserId })

            user.avatar = req.file.path
            await user.save()

            return res.json({
                message: "User updated"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during user avatar update"
            })
        }
    }

    async updatePassword (req, res) {
        try {
            if (!req.UserId) {
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }

            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }

            const user = await UserModel.findOne({_id: req.UserId})

            const oldPassword = await bcrypt.compare(req.body.oldPassword, user.password)

            if (!oldPassword) {
                return res.status(400).json({
                    message: "Incorrect password"
                })
            }

            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(req.body.newPassword, salt)

            user.password = newPassword
            await user.save()

            return res.json({
                message: "Password changed"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during password change"
            })
        }
    }
}

export default new UserController()