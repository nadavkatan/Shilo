const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const {validatePassword} = require('../utils/crypto.utilities')

const verifyCallback = async(username, password, done)=>{
    try{
        const user = await User.findOne({username:username});
        console.log(username)
        console.log(user)
        if(!user){
           return done(null, false, {message: "No user with that username"})
        }

        const valid = validatePassword(password, user.hash, user.salt);
        if(valid){
           return done(null, user)
        }else{
           return done(null, false, {message: "Incorrect password"})
        }
    }catch(err){
       return done(err);
    }
}

const strategy = new localStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done)=>{
   return done(null, user.id)
});

passport.deserializeUser(async(userId, done)=>{
    try{
        const user = await User.findById(userId);
       return done(null, user)
    }catch(err){
       return done(err);
    }
})