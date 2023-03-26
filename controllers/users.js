const User = require("../models/user");
module.exports.renderRegisterFrom = (req, res) => {
    res.render("users/register");
};
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registredUser = await User.register(user, password);
        req.login(registredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcom to yelp camp !");
            res.redirect("/campgrounds");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
};
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};
module.exports.login = (req, res) => {
    // other thing to do with the loged in user .
    // this controler is called login but it's not realy the reponsible from the login , the login is donne in the midelware that is used just befor this controler .
    req.flash("success", "welcome back !");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        return next(err);
    });
    req.flash("success", "you are loged out !");
    res.redirect("/campgrounds");
}; 