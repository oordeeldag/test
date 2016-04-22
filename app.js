var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    moment        = require('moment-jalaali'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    User          = require('./models/user');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/friends");

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "Touka is cute",
	resave: false,
	saveUninitialized: false	
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res, next){
	res.locals.currentUser = req.user;
	next();
})

var friendSchema = new mongoose.Schema({
	name: String,
	age: Number
});

var Friend = mongoose.model("Friend", friendSchema);



// Friend.create({
// 	name: "Mehdi",
// 	age: 37
// },function(err, friend){
// 	if(err){
// 		console.log("Error!");
// 	} else {
// 		console.log("Friend added!");
// 	}
// });

// Friend.create({
// 	name: "Sepideh",
// 	age: 29
// },function(err, friend){
// 	if(err){
// 		console.log("Error!");
// 	} else {
// 		console.log("Friend added!");
// 	}
// });

// Friend.find({}, function(err, friends){
// 	if(err)
// 	{
// 		console.log("OH NOOOO!!!!");
// 	} else {
// 		console.log("This are my friends....");
// 		console.log(friends);
// 	}
// })




app.get("/", function(req, res){
	res.render("home", {moment: moment});
});

app.get("/friends", isLoggedIn, function(req, res){
	Friend.find({}, function(err, friends){
		if(err){
			console.log("ERROR!");
		} else {
			res.render("friends", {friends: friends, moment: moment});
		}
		
	});
});

app.get("/friends/:id", function(req, res){
	Friend.findById(req.params.id, function(err, foundFriend){
		if(err){
			res.redirect("/friends");
		} else {
			res.render("show", {friend: foundFriend});	
		}
		
	});
	
});

app.post("/addfriend", function(req, res){
	var newFriend = req.body.newfriend;
	Friend.create({name:newFriend, age: 0});
	res.redirect("/friends");
});

// ==============
//  AUTH ROUTES
// ==============

// Show register form
app.get("/register", function(req, res){
	res.render("register");
})

// Handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err)
		{
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/friends");
		});
	});
});

// Show login form
app.get("/login", function(req, res){
	res.render("login");
});

// Handling login logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/friends",
		failureRedirect: "/login"
	}), function(req, res){

});

// Logout route
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
})

function isLoggedIn (req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.listen(80, function(){
	console.log("Server started.");
});

