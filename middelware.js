const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError")
// validation midelware fo the campgrounds body.
module.exports.validateCampground = (req, res, next) => {
    console.log(req.body);
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        console.log(error);
        throw new ExpressError(error.details.map(el => el.message).join(), 400);
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => { // body validation with joi for the review model .
    const { error } = reviewSchema.validate(req.body);
    console.error(error);
    if (error) {
        throw new ExpressError(error.details.map(el => el.message).join(), 400);
    } else {
        next();
    }
}
module.exports.needToBeLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in first !");
        return res.redirect("/login");
    }
    next();
};
module.exports.needToBeAuthorOfCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
module.exports.needToBeAuthorOfReview = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
module.exports.addFlashMessageToReqLocals = (req, res, next) => {
    // since this midelware get executed for every request .
    // the folwoing code will add any request link to the session if if the url is diferent from how so the login can know from what waz the last url the user was trying to to acess that need to be loged in 
    if (!["/login", "/"].includes(req.originalUrl)) {

        req.session.returnTo = req.originalUrl;
        // if the usrl i /login we dont want to change the url .
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
}