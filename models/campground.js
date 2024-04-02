const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema ({
    title: String,
    price: String,
    description: String,
    location: String
})

// compile the model
module.exports = mongoose.model ('Campgroud', CampGroundSchema)