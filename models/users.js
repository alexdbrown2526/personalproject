var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    playlist: Array
});

var UserSchema = mongoose.model('user', User);

module.exports = UserSchema;