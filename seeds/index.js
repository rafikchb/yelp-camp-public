const mongoose = require("mongoose");
const Campground = require("./../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
let numberOfSeeds = process.argv[2] || 20;

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("erro", console.error.bind(console, "connection error : "));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < numberOfSeeds; i++) {
        const city = sample(cities);
        const price = Math.floor(Math.random() * 20) + 10;
        const campground = new Campground({
            author: "641039e5b86165d16824858e", // added this line so all the comapgrounds belong to the suer colt . 
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${city.city}, ${city.state} `,
            images: [{ url: "http://source.unsplash.com/collection/484351", filename: "/484351" }],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam deleniti sed, id voluptatum voluptates pariatur blanditiis, reprehenderit impedit ipsa incidunt, odit ea! Dicta dolorem, esse officia beatae adipisci fugit similique?",
            price,
            geometry: {
                type: 'Point',
                coordinates: [city.longitude, city.latitude]
            }
        });
        await campground.save();
    }
}

seedDB().then(() => {
    console.log(`database seeded with ${numberOfSeeds} object`);
    mongoose.connection.close();
})



