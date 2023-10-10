import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import UserModel from "../models/UserModel.js"

dotenv.config({ path: new URL("../.env", import.meta.url) })
const JWT_SECRET = process.env.JWT_SECRET || "secret"

export default async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        let UserId

        if (token) {
            jwt.verify(token.split(" ")[1], JWT_SECRET, (error, data) => {
                if (error) {
                    return res.status(403).json({
                        message: "Invalid token"
                    })
                }
                
                UserId = data.id
            })
    
            const user = await UserModel.findOne({_id: UserId})

            if (user) {
                req.UserId = UserId
                user.online = Math.floor(new Date().getTime() / 1000)
                await user.save()
            }
        }

        next()
        
    } catch (error) {
        console.error(error) // видалити
    }
}