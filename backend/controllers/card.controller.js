const Card = require('../models/card.model');

const addCard = async(card)=>{
    const newCard = new Card(card);
    try{
        await newCard.save();
        return newCard
    }catch(err){
        console.log(err);
    }
}

const getAllCards = async()=>{
    try{
        const cards = await Card.find({});
        return cards
    }catch(err){
        console.log(err);
    }
}

const getCardsInSet = async(setName)=>{
    try{
        const cards = await Card.find({set:setName});
        return cards
    }catch(err){
        console.log(err);
    }
}

const getCardsBySetId = async(setId)=>{
    try{
        const cards = await Card.find({setId:setId});
        console.log(cards);
        return cards
    }catch(err){
        console.log(err);
    }
}

const findOneCard = async(cardId)=>{
    try{
        const card = await Card.find({id: cardId});
        return card
    }catch(err){
        console.log(err);
    }
}

const updateCard = async(id, update)=>{
    try{
        const updatedCard = await Card.findOneAndUpdate({id: id}, update, {new: true});
        return updatedCard;
    }catch(err){
        console.log(err);
    }
}

const deleteCard = async(cardId)=>{
    console.log(cardId);
    try{
        const card = await Card.findOneAndDelete(cardId);
        return card
    }catch(err){
        console.log(err);
    }
}

const deleteCardById = async(id)=>{
    try{
        const card = await Card.findByIdAndDelete({_id:id});
    }catch(err){
        console.log(err)
    }
}

module.exports= {addCard, getAllCards, findOneCard, updateCard, deleteCard, getCardsInSet,deleteCardById, getCardsBySetId};