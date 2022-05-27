const router = require('express').Router();
const {getAllFolders, createFolder, getOneFolder, updateFolder, getFolderById, removeSetFromFolder, deleteFolder} = require('../controllers/folder.controller');

router.post("/all", async(req, res) => {
    console.log("req.body: ", req.body);
    const folders = await getAllFolders(req.body.username);
    res.status(200).json(folders);
})

router.get("/:id", async(req, res) => {
    console.log(req.params.id)
    const folder = await getFolderById(req.params.id);
    res.status(200).json(folder);
})

router.post("/", async(req, res) => {
    const newFolder = await createFolder(req.body);
    console.log(newFolder);
    res.status(200).json(newFolder);
})

router.post("/one", async(req, res) => {
    const folder = await getOneFolder(req.body.folder_name);
    res.status(200).json(folder);
})

router.put("/", async(req, res) =>{
    const updated = await updateFolder(req.body.folder, req.body.update);
    res.status(200).json(updated);
})

router.put("/remove-set", async(req, res) =>{
    const updated = await removeSetFromFolder(req.body.username, req.body.folder, req.body.update)
})

router.delete("/", async(req, res) =>{
    const deleted = await deleteFolder(req.body.username, req.body.folder);
    res.status(200).json('Folder deleted');
})


module.exports = router;