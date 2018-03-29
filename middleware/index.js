var Campground=require("../models/campground.js");
var Comment=require("../models/comment.js");

var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
        //is user logged in?
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id,function(err,foundCampground){
            if (err) {
                req.flash("error","Campground not found"); 
                res.redirect("back") //redirect back to previous page
            }   else {
                //does user own this campground?
                if (foundCampground.author.id.equals(req.user._id)) {   //.equals is a mongoose method to compare variables regardless of type (string/value)
                    next();    // if campground author = user, go to next step. can be edit, delete etc.
                }  else {
                    req.flash("error","You do not have permission to do this"); 
                    res.redirect("back");
                }
               }
            });
        }   else {
            req.flash("error","You need to be logged in to do that"); 
            res.redirect("back");
        }
}


middlewareObj.checkCommentOwnership=function(req,res,next){
        //is user logged in?
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id,function(err,foundComment){
            if (err) {
                res.redirect("back") //redirect back to previous page
            }   else {
                //does user own this comment?
                if (foundComment.author.id.equals(req.user._id)) {   //.equals is a mongoose method to compare variables regardless of type (string/value)
                    next();    // if campground author = user, go to next step. can be edit, delete etc.
                }  else {
                    req.flash("error","You do not have permission to do this"); 
                    res.redirect("back");
                }
               }
            });
        }   else {
            req.flash("error","You need to be logged in to do this"); 
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn=function(req,res,next){  //define isLoggedIn function. If user is logged in, go to next(), which calls the next callback function. Otherwise, redirec to login page. 
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in to do that");   //When this middleware is triggered (e.g. when creating new campground), it adds flash "you need to be logged in first" to next action which is /login
    res.redirect("/login");
}


module.exports=middlewareObj

