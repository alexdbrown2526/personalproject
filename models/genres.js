var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newSchema = new Schema({
    title: String,
    genre: String,
    index: Number
});

var genreSchema = mongoose.model('genre', newSchema);

module.exports = genreSchema;