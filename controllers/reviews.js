const Review = require("../models/review"); // mongoose model .
const Campground = require("../models/campground");// mongoose model.
module.exports.add = async (req, res) => {
    // find the campground conserned by the review 
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id; // to assosiate the currently autenticated user to the creted review .
    campground.reviews.push(review);
    // in the folowing we are awaiting for two operation that we can do in paralele to gain time 
    // do not do this is the operatins taks time .
    await review.save();
    await campground.save();
    req.flash("success", "Created new Review !");
    res.redirect(`/campgrounds/${req.params.id}`)
}; 
module.exports.delete = async (req, res) => {
    // this route will cause and update in the comapgrounds , we update the reviews array . 
    // and a delete in the reviews.
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // a very interesting query , that we use to find by id and update the array from pulling a value that is equal to reviewsId
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review !");
    res.redirect(`/campgrounds/${id}`);
}; 