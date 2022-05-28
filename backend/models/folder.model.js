const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    folder_name: {type: String, required: true},
    sets:[String],
    user: {type:String, required: true, trim: true},
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;