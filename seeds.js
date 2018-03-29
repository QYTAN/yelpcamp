var mongoose=require("mongoose");
var Campground=require("./models/campground.js");
var Comment=require("./models/comment.js");

var data=[
    {
    name:"Forest Camp",
    image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
    description:"This is a forest camp"
    },
    {
    name:"Desert Camp",
    image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
    description:"This is a desert camp"
    },
    {
    name:"Grassland Camp",
    image:"https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg",
    description:"This is a grassland camp"
    },
]


function seedDB(){
//Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        } else {console.log("removed campgrounds!")
            };
// //Add new campgrounds. Put this inside the call back so that it will run after campgrounds have been removed
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if (err){
                    console.log(err);
                } else {
                    console.log("added a campground");
// //create comment
                    Comment.create(
                        {
                        text:"This place is great, but i wish there was internet",
                        author:"Homer"
                    },  function(err,comment){
                        if(err){
                            console.log(err);
                        } else {
                            campground.comments.push(comment._id);
                            campground.save();
                        }
                    });
                }
            });
        });
     });    
}

module.exports=seedDB;

//Remove all campgrounds