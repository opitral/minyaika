import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import db from "./db.js"
import AuthRouter from "./routers/AuthRouter.js"
import PostRouter from "./routers/PostRouter.js"
import UserRouter from "./routers/UserRouter.js"
import SearchRouter from "./routers/SearchRouter.js"
import CityRouter from "./routers/CityRouter.js"

dotenv.config()
const SERVER_PORT = process.env.SERVER_PORT || 4000

const app = express()
app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"))

app.use("/api/auth", AuthRouter)
app.use("/api/user", UserRouter)
app.use("/api/post", PostRouter)
app.use("/api/search", SearchRouter)
app.use("/api/city", CityRouter)

app.listen(SERVER_PORT, (error) => {
    if (error) {
        console.error(`Помилка під час запуску сервера: ${error}`)

    } else {
        console.log(`Сервер працює на порту: ${SERVER_PORT}`)
    }
})