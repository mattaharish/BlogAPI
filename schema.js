var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//schema of blog collection
var blogSchema = new Schema({
	Author: {type: String, required: true},
	Email: {type:String},
	blogHeading: {type: String, required: true},
	blogSubHeading: {type: String, required: true},
	blogBody: {type: String, required:true},
	createdOn: {type:Date},
	updatedOn: {type:Date},
	tags: [],
	comments: []
});

//creating model using the above schema
var Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;