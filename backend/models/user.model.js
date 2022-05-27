const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true, trim: true},
    last_name: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true, unique: true},
    email: {type: String, required: true, trim: true, unique: true},
    hash: {type: String, required: true, trim: true},
    salt: {type: String, required: true, trim: true}
});

const User = mongoose.model('User', userSchema);

module.exports = User;