const express = require ('express');
const app = express ();
const path = require ('path');
const mongoose = require('mongoose');
const Campgroud = require ('./models/campground')

// connect to mongodb and handle the connection error.
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').
    catch (error => handleError(error));

app.set ('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'views'));

app.get('/', (req, res)=>{
    res.render ('home')
})

app.get('/makecampgroud', async (req, res)=>{
    const camp = new Campgroud({title:'My backyard', description: 'Free camping'})
    await camp.save();
    res.send (camp)
})

app.listen(3000, () =>{
    console.log('Serving on port 3000')
})