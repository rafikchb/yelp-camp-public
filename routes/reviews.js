const express = require("express");
const router = express.Router({ mergeParams: true })// ajout de l'option mergeParams: true , car on a utiliser les parametre dnas l'url de us qui utiliser ce router
const catchAsync = require("../utils/catchAsync");
const { validateReview, needToBeLoggedIn, needToBeAuthorOfReview } = require("../middelware");
const review= require("../controllers/reviews"); 
// app route for reviews 
router.post("/", needToBeLoggedIn, validateReview, catchAsync(review.add));

router.delete("/:reviewId",needToBeLoggedIn ,needToBeAuthorOfReview,catchAsync(review.delete));

module.exports = router; 