const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // faire trer attention a cette propriter unique car ce ne'est pas une validation elle ne sera pas verifier si on fait validate  , j'est ecrit un mot sur ça voire les note  
    }
});

userSchema.plugin(passportLocalMongoose); // plugin in the functionlity provided by the passport localmongoose modul , as it's add the username and the passport 
module.exports = mongoose.model("User", userSchema); 