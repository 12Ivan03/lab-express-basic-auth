const router = require("express").Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const{ isLoggedIn, isLoggedOut } = require('../middlewares/route-guard')

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// Hash little password don't save the real words. :D
// Alretnative**
router.post("/signup", (req, res) => { 

    const { username, password, name } =  req.body

    console.log('this is the BODY',req.body)

    if(username === '' || password === ''){
        res.render('auth/signup', {errMsg: "Please fill in all the required spaces"})
        return;
    }

    User.findOne({username})
        .then((foundUser) => {
            if(foundUser) {
                res.render('auth/signup', {err: 'Existing user'})
            }
            else {
                bcrypt.hash(password, saltRounds)
                .then((hash) => {
                    return User.create({username, password: hash, name})
                })
                .then(user => {
                    req.session.currentUser = user;
                    res.redirect('/profile')
                })
            }
        })
        .catch((err)=>console.log(err))
});

router.get('/login', isLoggedOut, (req, res, next) => { //, isLoggedOut, <== is a middleware to check if the request(person) is logged in or not... and execute the appropriate route. '/login' is the incomming route
    res.render('auth/login') // <== point to the route to render it on the layout... when render no / begins.
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    if(username === '' || password === ''){
        res.render('auth/login', {errMsg: "Please fill in all the required spaces"})
        return;
    }

    User.findOne({username})

        .then((LogUser) => {
            if(!LogUser) {
                res.render('auth/login', {errMsgUser: "Inccorect Username"})
                return;
            }

            bcrypt.compare(password, LogUser.password)
                .then((approvedPwd) => {
                    if(approvedPwd) {
                        req.session.currentUser = LogUser
                        res.redirect('/profile')
                    } else {
                        res.render('auth/login', {errMsgPwd: "Inccorect Password"})
                    }
                })
                .catch((err) =>console.log(err))


            // it's not synchronous 
            // else if (bcrypt.compare(password, LogUser.password)){
            //     console.log('PASSWORD FROM THE LOG USER:',LogUser.password)
            //     req.session.currentUser = LogUser
            //     res.redirect('/profile')
            // } else {
            //     res.render('auth/login', {errMsg: "Inccorect Username and/or Password"})
            // }
        })
        .catch((err) =>console.log(err))
});


router.get('/profile', isLoggedIn, (req, res, next) => {
    console.log('curent user/s id', req.session.currentUser._id)
    const userId = req.session.currentUser._id
    User.findById(userId) 
        .then((user) => {
            res.render('auth/profile', {user})
        })
        .catch((err)=>console.log(err))
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/')
    })
})

router.get('/main', (req, res) => {
    res.render('main')
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('private')
})

router.get('/edit-profile/:userId', (req, res, next ) => {
    const {userId} = req.params;

    User.findById(userId)
        .then(() => {
            //console.log(req.session.currentUser)
            res.render('auth/edit-profile', {foundUser: req.session.currentUser})
        })
        .catch((err) => console.log(err))
});

router.post('/edit-profile/:userId', (req,res,next) => {
    const {userId} = req.params;
    console.log(req.params)

    User.findByIdAndUpdate(userId, req.body, {new: true})
        .then((updateUser) => {
            console.log('updated user',updateUser)
            res.redirect('/profile')
        })
        .catch((err) => console.log(err))
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
