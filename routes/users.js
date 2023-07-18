const router = require("express").Router();
const {User , validate} = require("../models/user")
const bcrypt = require('bcrypt')

router.post('/', async(req , res )=>{
    console.log(req.body)
    try{
        const {error} =validate(req.body)
        if(error){
            return res.status(400).send({message : error.details[0].message})
        }
        const user = await User.findOne({email : req.body})
        if(user){
            return res.status(409).send({message : "user with given emaill already exist !"})
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({...req.body , password : hashPassword}).save()
        res.status(200).send({message:"user created successfully"})
    }
    catch(error){
        res.status(500).send({message: "Enteral Server Error line 22"})
    }
})

module.exports = router