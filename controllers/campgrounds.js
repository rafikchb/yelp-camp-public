const Campground = require("../models/campground"); // campground model 
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    // original route "/campgrounds"
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
};
module.exports.renderNewForm = (req, res) => {
    // original route "/campgrounds/new"
    res.render("campgrounds/new.ejs");
};
module.exports.new = async (req, res, next) => {
    // original route "/campgrounds"
    const response = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    // adding the geojson object provided by the mapbox api , into the model 
    campground.geometry = response.body.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    await campground.save();
    // flash after we have succesfuly save .
    req.flash("success", "Sucessfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.show = async (req, res) => {
    // original route "/campgrounds/:id"
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews" // to pupulate the review filed   
        , populate: {
            path: "author"// to populate the author field of each review .
        }
    }).populate("author");// to pupulate the author field.

    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
};
module.exports.renderEditForm = async (req, res) => {
    // original route "/campgrounds/:id/edit"
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit.ejs", { campground });
};
module.exports.edit = async (req, res) => {
    // original route "/campgrounds/:id"
    console.log("body from edit", req.body);
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); // we used destructuring just for fun .
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.images.push(...images);


    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            console.log(filename);
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    campground.save();  // we can see that we i am doing this n two time wich is notefficient but it for readability ;

    req.flash("success", `Sucessfully updated campground!`);
    res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.delete = async (req, res) => {
    // original route "/campgrounds/:id"
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Campground !");
    res.redirect("/campgrounds");
}; 