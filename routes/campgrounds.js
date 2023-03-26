const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary"); // no need to specify the index node automaticly look for an index file .
const upload = multer({ storage });

const { needToBeLoggedIn, needToBeAuthorOfCampground, validateCampground } = require("../middelware");
const campground = require("../controllers/campgrounds");

router.route("/")
    .get(catchAsync(campground.index))
    .post(needToBeLoggedIn, upload.array("image"), validateCampground, catchAsync(campground.new));


router.get("/new", needToBeLoggedIn, campground.renderNewForm);

router.route("/:id")
    .get(catchAsync(campground.show))
    .put(needToBeLoggedIn, needToBeAuthorOfCampground, upload.array("image"), validateCampground, catchAsync(campground.edit))
    .delete(needToBeLoggedIn, needToBeAuthorOfCampground, catchAsync(campground.delete));

router.get("/:id/edit", needToBeLoggedIn, needToBeAuthorOfCampground, catchAsync(campground.renderEditForm));




module.exports = router; 