const router = require('express').Router();
const passport = require('passport');
const createUser = require('../controllers/auth.controller');
const mongoose = require('mongoose');
const User = require('../models/user.model');

router.post("/register", async(req,res)=>{
     User.findOne({username: req.body.username},async (err, user)=>{
        if(err) throw err;
        if(user) {
            res.send("User already exists");
        }
        if(!user){
            const createdUser = await createUser(req.body);
            res.status(201).json(createdUser);
            console.log("User doesn't exists")
        }
    })

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (e, user, info) => {
        if(e) return next(e);
        if(info) return res.json({info, isAuth: false});
        req.logIn(user, e => {
            if(e) return next(e);
            console.log(req.session);
            return res.json({isAuth: true}) 
            
        });
    })(req, res, next);
});


router.get("/logout", (req, res)=>{
    console.log(req.user)
     req.logout();
    // res.clearCookie("connect.sid", {path: "/"});
    // if(!req.session){
    //     req.session.destroy()
        // res.json(false)
    // }else{
    //     res.redirect("/login")
    // }
    req.session.destroy((err)=>{
        res.clearCookie("connect.sid", {path: "/"})
        res.json(false)
            // mongoose.connection.db.collection('sessions').deleteMany({})
    });
})

router.get("/check-auth", (req, res)=>{
    if(req.isAuthenticated()){
        res.json({isAuth: true, user: req.user.username})
    }else{
        res.json({isAuth: false})
    }
})

module.exports = router;