const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const joi = require('joi')
const passwordComplexity = require("joi-password-complexity")

const userSchema = new mongoose.Schema({
    fullName:{type : String , require : true},
    phoneNumber:{type : String , require : true},
    email:{type : String , require : true},
    password:{type : String , require : true},
    selectedRole:{type : String , require : true},
})

userSchema.method.generateAuthToken = function (){
    const token =jwt.sign({_id: this._id},process.env.JWTPRIVATEK, {expiresIn : "7d"})
    return token
}


const User = mongoose.model("user" , userSchema)

const validate = (data) =>{
    const schema = joi.object({
        fullName : joi.string().required().label("fullName"),
        phoneNumber: joi.string().required().label("phoneNumber"),
        email: joi.string().email().required().label("email"),
        password: passwordComplexity().required().label("password"),
        selectedRole : joi.string().required().label("selectedRole"),
    });
    return schema.validate(data)
}

module.exports = {User , validate}