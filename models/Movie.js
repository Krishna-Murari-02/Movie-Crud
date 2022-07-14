const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  createrName: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  rating: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    default: "",
    required: true,
  },
  release_date: {
    type: String,
    default: "",
  },
  cast: {
    type: [String],
    default: [],
  },
  img: {
    type: String,
    default: "",
  },
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
