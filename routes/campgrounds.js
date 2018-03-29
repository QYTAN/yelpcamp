var express=require("express");
var router=express.Router();
var Campground=require("../models/campground.js");
var methodOverride=require("method-override");
var middleware=require("../middleware");
var Campground=require("../models/campground.js");
var Comment=require("../models/comment.js");

router.use(methodOverride("_method"));


// Show all campgrounds
router.get("/",function(req,res){
    // get all campgrounds from db to show on screen
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index.ejs",{campgrounds:campgrounds});
        }
    });
});

//create route
router.post("/", middleware.isLoggedIn, function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name, price:price, image:image, description:desc, author:author}
    // create new campground and save to DB
    Campground.create(newCampground,function(err,Newlycreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

//New route
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
});


//show campgrounds with more information
router.get("/:id",function(req,res){
    // find the campground with provided id
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("err");
        } else{
            res.render("campgrounds/show.ejs",{campground:foundCampground});
        }
    });
})

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.id, function(err,foundCampground){   //middleware has checked that campground is created by user, proceed to next step which is to render edit file
            res.render("campgrounds/edit.ejs", {campground:foundCampground});
    });
});   

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){  //the id to find, data to update with, and callback
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Destroy campground

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");
        }  else {
            res.redirect("/campgrounds");
        }
    })
})


module.exports=router;