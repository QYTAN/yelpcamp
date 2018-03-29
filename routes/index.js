var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user.js");


//root route
router.get("/",function(req,res){
    res.render("landing.ejs");
})

// ==========
// Auth routes
// ===========


//show register form
router.get("/register",function(req,res){
    res.render("register.ejs");
})


//handling user sign up
router.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){      //Create a new user with username but not advisable to save password to database. We pass it in as an argument and then it will be saved later as "hash" and to be decoded with "salt"
        if (err) {
            //req.flash("error",err.message);    //err is the err coming back from the callback. This is provided by passport.
            return res.render("register.ejs",{error:err.message}); //use this code to prevent bug(need to click twice for error message to appear)
        }
        passport.authenticate("local")(req,res,function(){   //passport.authenticate saves everything and runs User.serializeUser method called above with local strategy (instead of facebook/twitter login)
            req.flash("success","Welcome to Yelpcamp " + user.username);     //user from callback function
            res.redirect("/campgrounds");
        });
    });
});

//show login form

router.get("/login",function(req,res){
    res.render("login.ejs");
})

//handle user login 

router.post("/login",passport.authenticate("local",{  //middleware. passport takes username and password and compares to database.
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}), function(req,res){
});

//logout route

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "logged you out");   //adds flash to /campgrounds route. message appear after /campgrounds is triggered
    res.redirect("/campgrounds");
})

//miaddleware
function isLoggedIn(req,res,next){  //define isLoggedIn function. If user is logged in, go to next(), which calls the next callback function. Otherwise, redirec to login page. 
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports=router;