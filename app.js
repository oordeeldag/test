var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var friends = ["Mehdi", "Sepideh", "Touka"];

app.get("/", function(req, res){
	res.render("home");
});

app.get("/friends", function(req, res){
	res.render("friends", {friends: friends});
});

app.post("/addfriend", function(req, res){
	var newFriend = req.body.newfriend;
	friends.push(newFriend);
	res.redirect("/friends");
})


app.listen(process.env.PORT);