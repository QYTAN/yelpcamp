var express=require("express");
var app= express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground.js");
var Comment=require("./models/comment.js");
var User=require("./models/user.js");
var seedDB=require("./seeds.js");

//requiring routes
var commentRoutes=require("./routes/comments.js");
var campgroundRoutes=require("./routes/campgrounds.js");
var indexRoutes=require("./routes/index.js");


//seeding the databse
//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp_v12");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",  //to decode the password
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());  //setting up passport
app.use(passport.session());    //setting up passport

passport.use(new LocalStrategy(User.authenticate()));  //creating a new LocalStrategy using User.authenticate method from passportlocalmongoose
passport.serializeUser(User.serializeUser()); /*User.serializeUser() function is already defined in passport-local-mongoose*/
passport.deserializeUser(User.deserializeUser()); /*User.deserializeUser() function is already defined in passport-local-mongoose*/


app.use(function(req, res, next){           // this is a middle ware
  res.locals.currentUser = req.user;        //whatever is in res.local will be available in all templates
  res.locals.error = req.flash("error");  //pass message variable to all templates. Message variable is needed to pass in the flash message
  res.locals.success = req.flash("success");
  next();                                   // need next() so that whatever is after the middleware will run
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelpcamp has started");
})