const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conn = mongoose.Collection;
var learnSchema = new mongoose.Schema({
	username: String,
    firstname: String,
    lastname: String,
    city: String,
    state: String,
    email: String,
    password: String,
    createdAt: Date
});
 
var regModel = mongoose.model('User', learnSchema);
module.exports = regModel;