const Set = require('../models/set.model');

const createSet = async(set)=>{
    const newSet = new Set(set);
    try{
        await newSet.save();
        return newSet
    }catch(e){
        console.log(e)
    }
}

// const getAllSets = async()=>{
//     const sets = await Set.find({});
//     return sets
// }
const getAllSets = async(username)=>{
    const sets = await Set.find({user:username});
    return sets
}

const getOneSet = async(id)=>{
    try{
        const set = await Set.findById(id);
        return set;
    }catch(e){
        console.log(e);
    }

}

const getByNameAndFolder= async(name, folder, username)=>{
    // const set = await Set.findOne({set_name: name, inFolder: folder});
    try{
        // const set = await Set.find({$or:[{set_name: name},{inFolder:folder}]});
        const set = await Set.find({set_name:name, inFolder:folder, user:username});
        console.log(set);
        return set
    }catch(e){
        console.log(e)
    }
}

const updateSet = async(username, setName, folder, update)=>{
    try{
        // const updated = await Set.findByIdAndUpdate(id, {$push: {cards: [cardId]}});
        const updated = await Set.findOneAndUpdate({user:username, set_name: setName, inFolder: folder}, {$push: {cards: [update]}});
        return updated;
    }catch(e){
        console.log(e)
    }
}

const removeCardFromSet = async(username, setName, folder, update)=>{
    try{
        const updated = await Set.findOneAndUpdate({user:username, set_name: setName, inFolder: folder}, {$pull: {cards: update}})
    }catch(e){
        console.log(e)
    }
}

const deleteSet = async(id)=>{
    try{
        const set = await Set.findOneAndDelete({setId: id});
    }catch(e){
        console.log(e)
    }
}

module.exports={createSet,getAllSets,getOneSet,getByNameAndFolder, updateSet, deleteSet, removeCardFromSet}