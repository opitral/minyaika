import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    category: {
        type: String,
        required: true
    },
    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    trades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trade"
        }
    ]
},
{
    timestamps: true
})

export default mongoose.model("Post", PostSchema)