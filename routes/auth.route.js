const router = require("express").Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// Hash little password don't save the words. :D
// Alretnative**
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
                    req.session.currentUser = user;
                    res.redirect('/profile')
                })
            }
        })
        .catch((err)=>console.log(err))
});

router.get('/login' ,(req, res) => {
    res.render('auth/login')
})

router.post('/login' ,(req, res) => {
    const { username, password } = req.body

    if(username === '' || password === ''){
        res.render('auth/login', {errMsg: "Inccorect Username and/or Password"})
        return;
    }

    User.findOne({username})
        .then((LogUser) => {
            if(!LogUser) {
                res.render('auth/login', {errMsg: "Inccorect Username and/or Password"})
                return;
            }
            else if (bcrypt.compare(password, LogUser.password)){
                req.session.currentUser = LogUser
                res.redirect('/profile')
            } else {
                res.render('auth/login', {errMsg: "Inccorect Username and/or Password"})
            }
        })

});


router.get('/profile', (req, res) => {
    console.log(req.session)
    if(req.session.currentUser) {
        res.render('auth/profile', {user: req.session.currentUser})
    } else {
        res.redirect('/login')
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/')
    })
})

router.get('/main', (req, res) => {
    res.render('main')
})

router.get('/private', (req, res) => {
    res.render('private')
})

module.exports = router;

// {user: req.session.currentUser}
//**Alternative
//<<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>>
// or with the bcryptjs => not sure if correct!

// const bcryptjs = require('bcryptjs');
//
// router.post("/signup", (req, res) => { 
//     const {username, password } = req.body
//
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
//  });
//<<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>>
