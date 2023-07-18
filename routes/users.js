const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {

  try {
    const { error } = validate(req.body);
    if (error) {
        console.log(error)
      return res.status(400).send({ message: error.details[0].message , data : "hello"});
    }

    const user = await User.findOne({ email: req.body.email }); // Use req.body.email to query by email
    if (user) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
