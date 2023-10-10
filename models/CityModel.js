import mongoose from "mongoose"

const CitySchema = new mongoose.Schema({
    ct: {
        type: String,
        required: true
    },

    nm: {
        type: String,
        required: true
    },

    rn: {
        type: String,
        required: true
    },

    cm: {
        type: String,
        required: true
    }
})

export default mongoose.model("City", CitySchema)