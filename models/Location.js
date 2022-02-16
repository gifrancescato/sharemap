const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new Schema({
    name: String,
    coords: [],
    reviews: [
        {
          user: String,
          text: String,
          rating: Number,
        },
      ],
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;