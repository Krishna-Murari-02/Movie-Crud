const router = require("express").Router();
const UserSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyUser = require("../verifyAuth");

router.post("/register", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    const newUser = new UserSchema({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/login", async (req, res) => {
  const user = await UserSchema.findOne({ username: req.body.username });

  try {
    bcrypt.compare(req.body.password, user.password, function (err, res) {
      if (err) {
        return res.status(403).json("username or password wrong.");
      }
    });
    const token = jwt.sign(
      { username: req.body.username },
      process.env.JWT_SEC
    );

    const { password, ...allInfo } = user._doc;

    const user1 = { user: allInfo, token: token };
    res.status(200).json(user1);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:username", verifyUser, async (req, res) => {
  const user = await UserSchema.findOne({ username: req.params.username });
  try {
    // console.log(req.user.username);
    // console.log(req.body.username);
    if (!user) {
      res.status(403).json("username is not here");
      return;
    } else if (req.user.username != req.params.username) {
      res.status(403).json("You can update only your profile");
      return;
    } else {
      const updatedUser = await UserSchema.findOneAndUpdate(
        {
          username: req.params.username,
        },
        req.body,
        { new: true }
      );
      res.status(201).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/delete/:username", verifyUser, async (req, res) => {
  const user = await UserSchema.findOne({ username: req.params.username });
  try {
    if (!user) {
      res.status(403).json("username is not here.");
      return;
    } else if (req.user.username != req.params.username) {
      res.status(403).json("You can delete only your profile");
      return;
    } else {
      const deletedUser = await UserSchema.findOneAndDelete({
        username: req.params.username,
      });
      res.status(201).json(deletedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
