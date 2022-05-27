const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    term: {type: String, required: true, trim: true},
    definition: {type: String, required: true, trim: true},
    set: {type: String, required: true, trim: true},
    defImgSrc: {type: String},
    id: {type: String, required: true, trim:true}
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;