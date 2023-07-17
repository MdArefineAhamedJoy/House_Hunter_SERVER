const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    email : {
      type: String,
      require: true,
      unique : true
    },
    password: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
  },
  {collection : 'user-data'}
);

const model = mongoose.model("UserData" , userDataSchema)

module.exports = userDataSchema;
