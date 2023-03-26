const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
// handeling initial connection
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl).
    catch(err => {
        console.error("Error while establishing initial connection to database.", err);
    });
// handeling any succesful connection or any other erro .
mongoose.connection.on('connected', () => {
    console.log("Successfully connected to database.");
}).on("error", err => {
    console.error("A database error occurred.", err);
});