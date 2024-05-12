const express = require ('express');
const app = express ();
const path = require ('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campgroud = require ('./models/campground')

// connect to mongodb and handle the connection error.
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').
    catch (error => handleError(error));

app.set ('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'views'));

app.use (express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

app.get('/', (req, res)=>{
    res.render ('home')
})

app.get('/campgrouds', async (req, res)=>{
    const campgrouds = await Campgroud.find({});
    res.render('campgrouds/index', {campgrouds})
  
})

app.get('/campgrouds/new', (req, res)=>{
    res.render('campgrouds/new')
})

app.post('/campgrouds', async (req, res)=>{
    const campgroud = new Campgroud(req.body.campgroud);
    await campgroud.save();
    res.redirect (`/campgrouds/${campgroud._id}`)

})

app.get('/campgrouds/:id', async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id);
    res.render('campgrouds/show', {campgrouds})
  
})

//EDIT function need 2 steps, one create get request and render a edit form. 
//Two, create a put request and render the edit form, redirect to a new page
//Step1:
app.get('/campgrouds/:id/edit', async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id);
    res.render('campgrouds/edit', {campgrouds})
  
})
//Step 2:Update the value with a PUT request and then redirect to a new page
app.put('/campgrouds/:id/', async (req, res) =>{
    const {id} = req.params;
    const campgrouds = await Campgroud.findByIdAndUpdate (id, {...req.body.campgroud});
    res.redirect(`/campgrouds/${campgrouds._id}`)
})

app.delete('/campgrouds/:id', async(req, res) =>{
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    res.redirect(`/campgrouds`);
})

app.listen(3000, () =>{
    console.log('Serving on port 3000')
})