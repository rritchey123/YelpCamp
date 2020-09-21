var express= require("express");
var router = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
	console.log("someone is trying to view the campgrounds");
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/Index",{campgrounds:allCampgrounds});
		}
	});
	//res.render("campgrounds",{campgrounds:campgrounds});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price= req.body.price;
	var author = {
	id: req.user._id,
	username: req.user.username
	}
	var newCampground = {name:name,image:image,description:desc,author:author,price:price};
	//create a new campground and save to mongodb
	Campground.create(newCampground,function(err,campground){
		if(err){
			console.log(err);
		} else {
			console.log("New campground created:");
			console.log(campground);
			res.redirect("/campgrounds");
		}
	});
	
	//campgrounds.push(newCampground);
	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back")
			console.log(err);
		} else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	
});

//===================EDIT CAMPGROUND ROUTE================
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	});
});


//==============UPDATE CAMPGROUND====================
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});

});

//===========DESTROY CAMPGROUND ROUTE==================
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	})
});
//========middleware============

//check if user logged in



module.exports = router;