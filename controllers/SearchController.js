import PostModel from "../models/PostModel.js"
import UserModel from "../models/UserModel.js"
import CityModel from "../models/CityModel.js"


class SearchController {
    async user (req, res) {
        try {
            const query = req.params.login

            const users = await UserModel.find({
                login: {
                  $regex: new RegExp(query), 
                  $options: 'i'
                }
              }, {
                avatar: 1,
                online: 1,
                login: 1
              })

            let data = []

            users.forEach(user => {
                if ((Math.floor(new Date().getTime() / 1000) - user.online) > 300) {
                    data = [...data, {
                        login: user.login,
                        avatar: user.avatar ? user.avatar : "no_user.svg",
                        online: false
                    }]

                } else {
                    data = [...data, {
                        login: user.login,
                        avatar: user.avatar ? user.avatar : "no_user.svg",
                        online: true
                    }]
                }
            })

            return res.json(data)

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during users search"
            })
        }
    }

    async post (req, res) {
        try {
            const query = req.params.title

            const posts = await PostModel.find({
                title: {
                    $regex: new RegExp(query), 
                    $options: 'i' 
                }
            }, {
                _id: 1,
                title: 1,
                images: 1
            })

            let data = []

            posts.forEach(post => {data = [...data, {
                    _id: post._id,
                    title: post.title,
                    image: post.images[0] ? post.images[0] : "no_post.svg"
                }]
            })

            return res.json(data)

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during posts search"
            })
        }
    }

    async city (req, res) {
        try {
            const query = req.params.name

            const cities = await CityModel.find({
                nm: {
                    $regex: new RegExp(query), 
                    $options: 'i' 
                }
            }).limit(10)

            return res.json(cities)

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during city search"
            })
        }
    }
}

export default new SearchController()