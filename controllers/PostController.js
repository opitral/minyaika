import PostModel from "../models/PostModel.js"
import UserModel from "../models/UserModel.js"
import { validationResult } from "express-validator"

class PostsController {
    async addPost(req, res) {
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

            const post = await PostModel.create({
                author: req.UserId,
                title: req.body.title,
                description: req.body.description,
                images: req.files.map(item => item.path),
                category: req.body.category
            })

            const user = await UserModel.findOne({_id: req.UserId})
            user.posts = [...user.posts, post._id]
            await user.save()

            return res.json({
                message: "Post created"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during post creation"
            })
        }
    }

    async deletePost(req, res) {
        try {
            const post = await PostModel.findOne(
                {_id: req.params.id}
            )

            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                })
            }

            if (!req.UserId) {
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }

            if (post.author != req.UserId) {
                return res.status(403).json({
                    message: "You do not have access"
                })
            }

            await post.deleteOne()

            const user = await UserModel.findOne({_id: req.UserId})
            user.posts = user.posts.filter(objectId => !objectId.equals(post._id))
            await user.save()

            return res.json({
                message: "Post deleted"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during post deletion"
            })
        }
    }

    async updatePost(req, res) {
        try {
            const post = await PostModel.findOne({_id: req.params.id})

            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                })
            }

            if (!req.UserId) {
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }

            if (post.author != req.UserId) {
                return res.status(403).json({
                    message: "You do not have access"
                })
            }

            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()
                })
            }
            
            post.title = req.body.title
            post.description = req.body.description
            post.images = req.files.map(item => item.path),
            await post.save()

            return res.json({
                message: "Post updated"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during post update"
            })
        }
    }

    async getOnePost (req, res) {
        try {
            const post = await PostModel.findOne({ _id: req.params.id })

            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                })
            }

            if (req.UserId) {
                const user = await UserModel.findOne({_id: req.UserId})

                if (!user.views.includes(post._id) && !user.posts.includes(post._id)) {
                    post.views = [...post.views, user._id]
                    await post.save()
    
                    user.views = [...user.views, post._id]
                    await user.save()
                }
            }

            return res.json({
                id: post._id,
                author: post.author,
                title: post.title,
                description: post.description,
                images: post.images,
                category: post.category,
                views: post.views ? post.views.length : 0,
                favorites: post.favorites ? post.favorites.length : 0,
                trades: post.trades ? post.trades.length : 0,
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during post retrieval"
            })
        }
    }

    async getPosts(req, res) {
        try {
            const skip = req.query.skip || 0
            const limit = req.query.limit || 10
            const category = req.query.category
            const search = req.query.search

            let posts

            if (req.UserId) {
                const user = await UserModel.findOne({_id: req.UserId})

                let filter = {}
                  
                if (category) {
                    filter._id = {$nin: [...user.posts]}
                    filter.category = category

                } else {
                    filter._id = {$nin: [...user.views, ...user.posts]}
                }

                posts = await PostModel.find(filter).sort({createdAt: -1}).skip(skip).limit(limit)

            } else {
                let filter = {}
                  
                if (category) {
                    filter.category = category
                }

                posts = await PostModel.find(filter).skip(skip).limit(limit).sort({createdAt: -1})
            }
            
            return res.json(posts)

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during post retrieval"
            })
        }
    }

    async addPostToFavotites (req, res) {
        try {
            const post = await PostModel.findOne({ _id: req.params.id })
            const user = await UserModel.findOne({_id: req.UserId})

            if (!post) {
                return res.status(404).json({
                    message: "Post not found"
                })
            }

            if (!req.UserId) {
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }

            if (user.posts.includes(post._id)) {
                return res.status(403).json({
                    message: "You cannot add your post to favorites"
                })
            }

            post.favorites = [...post.favorites, post._id]
            await post.save()

            
            user.favorites = [...user.favorites, post._id]
            await post.save()

            return res.json({
                message: "Post added to favorites"
            })

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error adding a post to favorites"
            })
        }
    }
}

export default new PostsController()