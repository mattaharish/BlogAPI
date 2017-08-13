var express = require('express');
var mongoose = require('mongoose');
var Blog = require('./schema.js'); //custom module
var app = express(); //creating instance of express application

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/blogdatabase');

/*API for Home Page*/

app.get('/', function(req,res){
	res.send("**API for BLOG Application**")
});


/*API to get all blog details*/

app.get('/allBlogs', function(req,res){
	//res.send("All blogs Data");
	Blog.find({},function(err,result){
		if(err) throw err;
		res.send(result);
	});
});


/*API to create new blog*/
app.post('/createBlog', function(req,res){
	var blogData = Blog(req.body);
	blogData.createdOn = Date(Date.now()).toString().slice(0,25);
	blogData.tags = req.body.tags.split(",");
	blogData.save(function(err){
		if(err) throw err;
	});

	res.send(blogData);
}); 


/*API to view single Blog details*/
app.get('/blog/:blogID', function(req,res){
	var id = req.params.blogID;
	Blog.findOne({_id:id},function(err,result){
		if(err) throw err;
		res.send(result);
	});
});


/*API to add comment the particular blog*/
app.post('/:blogID/comment', function(req,res){
	
	var id = req.params.blogID;
	
	var comment=req.body.comment;
	Blog.findOne({_id:id},function(err,result){
		if(err) throw err;
		result.comments.push(comment);
		
		Blog.findOneAndUpdate({_id:id}, result,function(err){
			if(err) throw err;
			res.send("Comment Added");
		});
	});
}); 


/*API to edit the blog*/
app.put('/blog/edit/:blogID', function(req,res){
	
	var modified = req.body;
	
	if(Object.prototype.hasOwnProperty.call(modified, 'tags')){
		modified.tags = modified.tags.split(",");
	}
	
	var id = req.params.blogID;
	modified.updatedOn = Date(Date.now()).toString().slice(0,25);
	Blog.findOneAndUpdate({_id:id}, modified, function(err){
		if(err) throw err;
		res.send("Updated");
	});
});


/*API to delete the blog*/
app.post('/delete/:blogID', function(req,res){
	var id=req.params.blogID;
	Blog.findOneAndRemove({_id:id},function(err){
		if(err) throw err;
		res.send("Blog deleted Successfully!");
	});
});

/*API to delete all blogs belongs to one author*/
app.post('/deletemany', function(req,res){
	var author=req.body.Author;
	Blog.deleteMany({"Author":author},function(err){
		if(err) throw err;
		res.send("Blogs deleted Successfully!");
	});
});

// catch 404 and forward to error handler
app.get('*',function(req, res, next) {
  req.status = 404;
  next("Page Not Found!!");
});

// error handler
app.use(function(err, req, res, next) {
  
  if(req.status==404){
  	res.send(err);
  }
});

app.listen(3000,function(){
	console.log("Server is running on port 3000!");
});