const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const mongoose = require("mongoose");
const connection = require("./db");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

connection();

app.use(cors());
app.use(express.json());

// routes

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const MONGO_URI = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.p45io4t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoDB!");

    const database = mongoose.connection.db;
    const storeHouse = database.collection("houses");

    app.get("/houses", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;
      const totalHouses = await storeHouse.countDocuments();
      console.log(totalHouses);
      const skip = (page - 1) * perPage;
      const houses = await storeHouse
        .find()
        .skip(skip)
        .limit(perPage)
        .toArray();
      res.json({
        houses,
        currentPage: page,
        totalPages: Math.ceil(totalHouses / perPage),
      });
    });

    app.post("/house", async (req, res) => {
      const houseData = req.body;
      const result = await storeHouse.insertOne(houseData);
      res.send(result);
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  })
  .on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World! House Hunting Start ");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
