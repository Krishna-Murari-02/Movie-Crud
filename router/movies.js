const router = require("express").Router();
const MovieSchema = require("../models/Movie");
const UserSchema = require("../models/User");
const verifyUser = require("../verifyAuth");

router.post("/upload", async (req, res) => {
  try {
    const newMovie = new MovieSchema(req.body);
    const movie = await newMovie.save();
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/findall/:username", verifyUser, async (req, res) => {
  const user = await UserSchema.findOne({ username: req.params.username });
  console.log(user);

  try {
    if (!user) {
      res.status(403).json("User is not here");
      return;
    } else if (req.user.username != user.username) {
      res.status(403).json("You can access only yours movie");
      return;
    } else {
      console.log("j");

      const allMovie = await MovieSchema.find({
        createrName: req.params.username,
      });
      res.status(200).json(allMovie);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:movieId", verifyUser, async (req, res) => {
  const movie = await MovieSchema.findById(req.params.movieId);
  try {
    if (!movie) {
      res.status(403).json("movie is not here");
      return;
    } else if (req.user.username != movie._doc.createdName) {
      res.status(403).json("You can update only your profile");
      return;
    } else {
      const updatedMovie = await MovieSchema.findByIdAndUpdate(
        req.params.movieId,
        req.body,
        { new: true }
      );
      res.status(201).json(updatedMovie);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete/:movieId", verifyUser, async (req, res) => {
  const movie = await MovieSchema.findById(req.params.movieId);
  try {
    if (!movie) {
      res.status(403).json("movie is not here.");
      return;
    } else if (req.user.username != movie._doc.createdName) {
      res.status(403).json("You can delete only your profile");
      return;
    } else {
      const deletedMovie = await MovieSchema.findByIdAndDelete(
        req,
        params.movieId
      );
      res.status(201).json(deletedMovie);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
