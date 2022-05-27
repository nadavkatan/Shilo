const mongoose = require('mongoose')

const setSchema = new mongoose.Schema({
        set_name: {type:String},
        inFolder: {type:String},
        cards: [String],
        setId: {type:String},
        user: {type:String, required: true, trim: true},
});

const Set = mongoose.model('Set', setSchema);

module.exports = Set;