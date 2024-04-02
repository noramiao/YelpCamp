const mongoose = require('mongoose');
const Campgroud = require ('../models/campground');
const cities = require ('./cities');
const {descriptors, places} = require ('./seedHelper')

// connect to mongodb and handle the connection error.
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.catch (error => handleError(error));

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () =>{
    await Campgroud.deleteMany({});
    for (let i =0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campgroud({ 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
