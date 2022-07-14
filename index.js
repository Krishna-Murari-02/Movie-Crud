const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./router/user");
const movieRouter = require("./router/movies");
const port = process.env.PORT || 5500;
const app = express();
dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use("/api/auth", userRouter);
app.use("/api/movies", movieRouter);

app.listen(port, () => {
  console.log("HI, Server is working right now..");
});
