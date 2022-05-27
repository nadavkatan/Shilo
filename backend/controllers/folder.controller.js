const Folder = require('../models/folder.model');

const getAllFolders = async(username)=>{
    const folder = await Folder.find({user: username});
    return folder;
}

const createFolder = async(folder)=>{
    const newFolder = new Folder(folder);
    try{
        newFolder.save();
    }catch(err){
        console.log(err);
    }
}

const getOneFolder = async(folderName)=>{
    try{
        const folder = await Folder.findOne({"folder_name": folderName});
        console.log(folder);
        return folder
    }catch(err){
        console.log(err)
    }
}

const deleteFolder = async(username, folder)=>{
    try{
            await Folder.findOneAndDelete({user: username, folder_name: folder});
    }catch(err){
        console.log(err)
    }
}

const getFolderById = async(id)=>{
    try{
        const folder = await Folder.findById(id);
        console.log(folder);
        return folder
    }catch(err){
        console.log(err)
    }
}

const updateFolder = async(folder, update)=>{
    try{
        const query = {"folder_name": folder}
        const updates = {
            "$set": {folder_name: update.folder_name},
            "$push": {sets: [update.set]}
        }
        const updated = await Folder.findOneAndUpdate(query, updates);
        return updated;
    }catch(e){
        console.log(e)
    }
}

const removeSetFromFolder = async(username,folder, update)=>{
    const updated = await Folder.findOneAndUpdate({username: username, folder_name: folder}, {$pull: {sets: update}})
}

module.exports = {getAllFolders, createFolder, getOneFolder, updateFolder, getFolderById, removeSetFromFolder, deleteFolder};