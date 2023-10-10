import CityModel from "../models/CityModel.js"

class CityController {
    async areas (req, res) {
        try {
            const areas = await CityModel.aggregate([
                { $group: { _id: '$rn' } }
              ])

            const areaNames = areas.map(a => a._id)

            return res.json(areaNames)

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during areas search"
            })
        }
    }

    async cities (req, res) {
        try {
            const query = req.params.name.toUpperCase()
            console.log(query)

            const cities = await CityModel.find({
                "rn": query,
                "ct": "М"
            }, {
                _id: 1,
                nm: 1
            })

            return res.json(cities)

        } catch (error) {
            console.error(error) // видалити
            return res.status(500).json({
                message: "Error during cities search"
            })
        }
    }
}

export default new CityController()