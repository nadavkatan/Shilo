const router = require('express').Router();
const {createSet,getAllSets, getOneSet, getByNameAndFolder, updateSet, deleteSet, removeCardFromSet} = require('../controllers/set.controller');
const Set= require("../models/set.model");
const mongoose = require('mongoose');

router.post("/", async(req,res)=>{
       const set= await createSet(req.body);
       console.log(set)
        res.status(201).json({message: 'Set added', set:set})

})

// router.get("/", async(req, res)=>{
//     const sets = await getAllSets();
//     res.status(200).json(sets);
// });

router.post("/all", async(req, res)=>{
    const sets = await getAllSets(req.body.username);
    res.status(200).json(sets);
});

router.post("/one", async(req, res)=>{
    const set = await getByNameAndFolder(req.body.name, req.body.folder, req.body.username);
    res.status(200).json(set);
})


router.get("/:id", async(req, res)=>{
    console.log(req.params.id)
    const set = await getOneSet(req.params.id);
    res.status(200).json(set);
})

router.put("/", async(req, res)=>{
    let updated = await updateSet( req.body.user, req.body.name, req.body.folder, req.body.update);
    res.status(200).json(updated);
})

router.put("/remove-card", async(req, res)=>{
    const updated = await removeCardFromSet(req.body.username, req.body.name, req.body.folder, req.body.update);
    res.status(200).json(updated)
})

router.delete("/", async(req, res)=>{
    let set = await deleteSet(req.body.id);
    res.status(200).json("Deleted set: " + set);
})

module.exports=router;