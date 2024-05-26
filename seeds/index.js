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
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campgroud({ 
            author: '6651bbec008b6b93d351dc48',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam iusto doloribus mollitia laborum, eius fuga voluptatem aperiam laboriosam asperiores dolores corrupti perspiciatis facere accusantium unde! Cumque maiores delectus sit veritatis!',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

// explaination:randon100 is a variable (in this case a number from 0 to 1000), to get the vaule from a array of object, use array[index].property (cities[random1000].city)

//the function to get a random value out of array:
//function (array) => {array[Math.floor(Math.random()*array.length)]} 


// sample is a function. this function is used to get a random value from a array (descriptor or/and places in this case). So when we call the function sample() and pass in the parameter (descriptor or places), we get a function that take a random value from array of descriptor and/or places.

// If rewrite using only the sample function: location: ${sample(cities).city},${sample(cities).state}