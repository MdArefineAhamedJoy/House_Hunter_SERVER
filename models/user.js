const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const joi = require('joi')
const passwordComplexity = require("joi-password-complexity")

const userSchema = new mongoose.Schema({
    firstName:{type : String , require : true},
    email:{type : String , require : true},
    password:{type : String , require : true},
    roll:{type : String , require : true},
    number:{type : String , require : true},
})

userSchema.method.generateAuthToken = function (){
    const token =jwt.sign({_id: this._id},process.env.JWTPRIVATEK, {expiresIn : "7d"})
    return token
}


const User = mongoose.model("user" , userSchema)

const validate = (data) =>{
    const schema = joi.object({
        firstName : joi.string().required().label("First Name"),
        email: joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        roll : joi.string().required().label("Roll"),
        number: joi.string().required().label("Number"),
    });
    return schema.validate(data)
}

module.exports = {User , validate}