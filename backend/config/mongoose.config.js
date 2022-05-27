const mongoose = require('mongoose');

const mongoConnect = async()=>{
    try{
       await mongoose.connect(process.env.MONGOOSE_URI)
    }catch(e){
        console.error(e);
    }
}

module.exports = mongoConnect;