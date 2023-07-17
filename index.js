const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.p45io4t.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const storeHouse = client.db("HouseHunter").collection("House");

    app.get("/api/houses", async (req, res) => {
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


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! House Hunting Start ");
});

app.listen(port, () => {
  console.log(` listening on port ${port}`);
});
