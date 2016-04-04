var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/friends");

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



// var friends = ["Mehdi", "Sepideh", "Touka"];

app.get("/", function(req, res){
	res.render("home");
});

app.get("/friends", function(req, res){
	Friend.find({}, function(err, friends){
		res.render("friends", {friends: friends});
	});
});
app.post("/addfriend", function(req, res){
	var newFriend = req.body.newfriend;
	friends.push(newFriend);
	res.redirect("/friends");
})


app.listen(process.env.PORT);