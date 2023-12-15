const router = require("express").Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// Hash little password don't save the words. :D

router.post("/signup", (req, res) => { 
    const { username, password } =  req.body

    User.findOne({username})
        .then((foundUser) => {
            if(foundUser) {
                res.render('auth/signup', {err: 'Existing user'})
            }
            else {
                bcrypt.hash(password, saltRounds)
                .then((hash) => {
                    return User.create({username, password: hash})
                })
                .then(user => {
                    res.redirect('/profile')
                })
            }
        })
        .catch((err)=>console.log(err))
})

//<<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>>

// or with the bcryptjs => not sure if correct!



// const bcryptjs = require('bcryptjs');

// router.post("/signup", (req, res) => { 
//     const {username, password } = req.body

//         User.findOne({username})
//             .then((usernameExist) => {
//                 if(usernameExist) {
//                     res.render('auth/signup', {err: "This Username is in use"})
//                 }
//                 else {
//                     bcryptjs
//                     .genSalt(saltRounds)
//                     .hash( password , salt)
//                     .then(hashedPassword => {
//                         User.create({username, password: hashedPassword})
//                         .then(() => {
//                             res.render('/profile')
//                         })
//                     }) 
//                 }
//             })
//             .catch((err) => console.log(err))
//  })

//<<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>>

router.get('/profile',(req, res) => {
    res.render('auth/profile')
})
module.exports = router;
