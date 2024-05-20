const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema ({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
});

// compile the model
module.exports = mongoose.model ('Campgroud', CampGroundSchema)