const router = require('express').Router();
const Card = require('../models/card.model');
const{getAllCards, updateCard, findOneCard, deleteCard, getCardsInSet, deleteCardById} = require('../controllers/card.controller');

router.get("/", async(req, res) => {
    const cards = await getAllCards();
    res.status(200).json(cards);
});

router.post("/one", async(req, res) => {
    const foundCard = await findOneCard(req.body);
});

router.post("/in-set", async(req, res) => {
    const cards = await getCardsInSet(req.body.setName);
    res.status(200).json(cards);
})

router.put("/", async(req, res) => {
    const updatedCard = await updateCard(req.body.id, req.body.update);
    // const updatedCard = await Card.findOneAndUpdate(req.body.id, req.body.update);
    res.status(200).json(updatedCard);
})

router.delete("/", async(req, res)=>{
    let card = await deleteCardById(req.body.id);
    res.status(200).json("Deleted card: " + card);
});

module.exports = router;