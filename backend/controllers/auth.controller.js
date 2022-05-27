const {genPassword} = require('../utils/crypto.utilities');
const User = require('../models/user.model');

const createUser = async(newUser)=>{
    const {password, ...restOfUser}= newUser;
    const saltAndHash = genPassword(password);
    const createdUser = new User({...restOfUser, ...saltAndHash});

    try{
       await createdUser.save();
       return createdUser
    }catch(err){
        console.log(err);
    }
}



module.exports = createUser;