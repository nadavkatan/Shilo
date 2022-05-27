const router = require('express').Router();
const {addCard} = require('../controllers/card.controller');

router.post("/", async(req, res) => {
    console.log(req.body)
   const card = await addCard(req.body);
    res.status(201).json({message: 'card add', card: card});
});


module.exports = router;