const Campgroud = require ('../models/campground');

module.exports.index = async (req, res)=>{
    const campgrouds = await Campgroud.find({});
    res.render('campgrouds/index', {campgrouds})
};

module.exports.renderNewForm = (req, res)=>{
    res.render('campgrouds/new')
};

module.exports.createCampground = async (req, res)=>{
    const campgroud = new Campgroud(req.body.campgroud);
    campgroud.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campgroud.author = req.user._id;
    await campgroud.save();
    console.log(campgroud);
    req.flash('success','Successfully made a new campground!');
    res.redirect (`/campgrouds/${campgroud._id}`)

};

module.exports.showCampground = async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campgrouds);
    if(!campgrouds){
        req.flash('error', 'Cannot find this Campground.');
        return res.redirect ('/campgrouds/')
    }
    res.render('campgrouds/show', {campgrouds})
  
};
//EDIT function need 2 steps, one create get request and render a edit form. 
//Two, create a put request and render the edit form, redirect to a new page
//Step1:
module.exports.renderEditForm = async (req, res)=>{
    const campgrouds = await Campgroud.findById(req.params.id);
    if(!campgrouds){
        req.flash('error', 'Cannot find this Campground.');
        return res.redirect ('/campgrouds/')
    }
     // Add the logic to check if the author is same as req.user._id. If not, protect the route with req.flash and res.redirect;
    // move the below function to a middleware called isAuthor.
    // if (!campgrouds.author.equals(req.user._id)){
    //     req.flash ('error', 'You do not have permission to edit this campground.');
    //     return res.redirect(`/campgrouds/${campgrouds._id}`)
    // }
    res.render('campgrouds/edit', {campgrouds})
};
//Step 2:Update the value with a PUT request and then redirect to a new page
module.exports.updateCampground = async (req, res) =>{
    const {id} = req.params;
    console.log(req.body);
    // to protect the edit routes, add logic we find the campground at first, then check if the author is the same as the currentUser. if yes, allow editing. using a middleware called isAuthor. 
    const campgrouds = await Campgroud.findByIdAndUpdate (id, {...req.body.campgroud});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campgrouds.images.push(...imgs);
    await campgrouds.save();
    req.flash('success','Successfully updated a campground!');
    res.redirect(`/campgrouds/${campgrouds._id}`)
}

module.exports.deleteCampground = async(req, res) =>{
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground!');
    res.redirect('/campgrouds')};