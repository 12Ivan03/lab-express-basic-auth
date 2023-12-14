const router = require("express").Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => { 
    const { username, password } =  req.body

    bcrypt.hash(password, saltRounds)
        .then((hash) => {
            return User.create({username, password: hash})
        })
        .then(user => {
            res.redirect('/profile')
        })
        .catch((err)=>console.log(err))
})

router.get('/profile',(req, res) => {
    res.render('auth/profile')
})
module.exports = router;
