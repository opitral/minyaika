import mongoose from "mongoose"

const TradeSchema = new mongoose.Schema({
    creator: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    proposer: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        default: "waiting"
    }
},
{
    timestamps: true
})

export default mongoose.model("Trade", TradeSchema)