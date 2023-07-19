const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const mongoose = require("mongoose");
const connection = require("./db");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const { ObjectId } = require("mongodb");

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
    const database = mongoose.connection.db;
    const storeHouse = database.collection("houses");
    const storeUser = database.collection("users");


    app.post("/house", async (req, res) => {
      const houseData = req.body;
      const result = await storeHouse.insertOne(houseData);
      res.send(result);
    });

    app.post("/houses", async (req, res) => {
      const houseData = req.body;
      const result = await storeHouse.insertOne(houseData);
      res.send(result);
    });

    app.get("/booking/:id" , async(req , res)=>{
      // const id = req.params.id 
      const id = req.params.id ;
      console.log()
      const query = {_id : new ObjectId(id)}
      const result = await storeHouse.findOne(query)
      console.log(result )
      res.send(result)
    })

    app.get("/houses", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;
      const totalHouses = await storeHouse.countDocuments();
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

    app.get('/all/house/:email' , async(req , res) => {
      const searchEmail = req.params.email
      const query = {email  :  searchEmail };
      const houses = await storeHouse.find(query).toArray()
      res.send(houses)
    })

  app.get("/users/:text", async (req, res) =>{
    const email = req.params.text
    const query = {email  :  email  };
    const houses = await storeUser.findOne(query)
    res.send(houses)
  })


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
