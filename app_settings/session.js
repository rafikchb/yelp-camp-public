const MongoStore = require('connect-mongo');
// session and session store config .
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
const secret = process.env.ENCREPTION_KEY;
const store = new MongoStore({
    mongoUrl: dbUrl,
    touchAfter: 10 * 24 * 3600, // 10 jour ., 
});
// catching any erro that comes from the store .
store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
});

module.exports.sessionConfig = {
    store,
    name: "sessionId",// just changeing the default name of the session cokies for a marge of security .
    secret: secret,
    resave: false,
    saveUninitialized: true,// pour ajouter un cokies a toute les requette pas que ls requette ou on a changer la session . 
    cookie: { // here we can set the  cookie parameter  ,lik the expiration time of the cookie in ms .
        expires: Date.now() + 1000 * 60 * 60 * 60 * 24 * 7, // to set the date at wich the cookies wil expire (the session will expire), we set it to be one week
        maxAge: 1000 * 60 * 60 * 60 * 24 * 7,
        httpOnly: true, // this to add security as this is a recomandation from the owasp see (owaspo on htttponly)
        // secure : true , so the cookies work only on https , commented for know as our server work on http.
    }
}