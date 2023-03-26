const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema; // this is just a short hand because we wil use mongoose.Schema alos when we get into the relation ship .


const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    // this keyword will refer to the image object that we are working with.
    return this.url.replace('/upload', '/upload/w_200');
})
const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    geometry: {// this is the geojson fields .
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);
campgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) { // we verify that we have delted something.
        // the comanted syntax will not be suported in the verssion 7 of mongoose ,it alrady deprecated in mongo .
        // await Review.remove({ 
        //     _id:{ 
        //         $in: doc.reviews
        //     }
        // }); 
        // the flowing syntaxe is the suported one 
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});
campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})
module.exports = mongoose.model("Campground", campgroundSchema); 
