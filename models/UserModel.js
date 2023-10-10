import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    trades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trade"
        }
    ],
    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    verification: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        token: {
            type: String
        }
    },
    recovery: {
        token: {
            type: String
        },
        expiration: {
            type: Number
        }
    },
    online: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
})

export default mongoose.model("User", UserSchema)