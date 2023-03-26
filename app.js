if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const { join } = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const { sessionConfig } = require("./app_settings/session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
//const helmet = require("helmet");
//const { contentSecurityPolicySetting } = require("./app_settings/helmetContentPolicy");
const { addFlashMessageToReqLocals } = require("./middelware");
const ExpressError = require("./utils/ExpressError");

// requiring the routers 
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const User = require("./models/user");

// db connection.
require("./models/dbConnect");

// app creation .
const app = express();

// app setting 
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// app midelware 
app.use(methodOverride("_method")); // allways need to be the first midelware .
app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // sanitize data .
// the helmet setting contain some bugs .
// app.use(helmet({
//     contentSecurityPolicy: contentSecurityPolicySetting
// }));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(addFlashMessageToReqLocals);

// plug-in the  routes.
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.get("/", (req, res) => {
    res.render("home");
});
app.all("*", (req, res) => {
    throw new ExpressError("Page Not Found", 404);
});

// handeling error .
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Soemthing went wrong";
    res.status(status).render("error", { err });
});

// bot up the server .
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});