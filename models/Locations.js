const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    name: String,
    rating: Number,
    coords: []
});
const Location = mongoose.model('Location', locationSchema);
module.exports = Location;