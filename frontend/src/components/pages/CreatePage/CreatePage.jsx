import { Typography, Input, Grid, Fab } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import Flashcard from "../../Flashcard/Flashcard";
import AddIcon from "@mui/icons-material/Add";
import {AppContext} from '../../Context/Context'
import { ToastContainer, toast } from 'react-toastify';


import axios from 'axios';

const CreatePage = () => {

  const {deleteSet, removeSetFromFolder} = useContext(AppContext);

  let newCard;

  const [defaultSet, setDefaultSet] = useState({
    setName: "",
    setId: Math.floor(Math.random()*1000000000),
    inFolder: "",
    cards: [{
      term:"",
      definition:"",
      defImgSrc:"",
      id: Math.floor(Math.random()*1000000000)
    }],
  });

  const validateCard = (card, currentFolder)=>{
    if(card.set && currentFolder){
    console.log("successful validation")
    console.log("set" , card.setName, "currentFolder", currentFolder)
    return true
    }
    if(!card.set){
      toast.error("Card must be assigned to set")
      return false
    }
    if(!currentFolder){
     toast.error("Card must be assigned to folder")
     return false
    }
  }

  // controll the folder and set names input values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setDefaultSet((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const deleteCardFromDefaultSet = (cardId)=>{
    setDefaultSet((prev) => {
      return {
        ...prev,
        cards: defaultSet.cards.filter(card => card.id !== cardId)
      };
    });
  }

  const updateCardInDefaultSet = (cardId, term, definition)=>{
    setDefaultSet((prev) => {
      return {
        ...prev,
        cards: defaultSet.cards.map(card =>{
          if(card.id === cardId){
            return {
              ...card,
              term: term,
              definition: definition
            }
          }
          return card
        })
      };
    });
  }


  // add an empty card to the set
  const addEmptyCard = async() => {
    newCard = {
      set: defaultSet.setName,
      term: "",
      definition: "",
      id: Math.floor(Math.random() * 100000000000000),
      defImgSrc: "",
    };
    setDefaultSet({
      ...defaultSet,
      cards:[...defaultSet.cards, newCard]
    })
  };

  // const editCardInDefaultSet = (cardId, property, value)=>{
  //   let card = defaultSet.cards.find(card=> card.id === cardId);
  //   card.property = value;
  //   const filteredCards = defaultSet.cards.filter(card => card.id !== cardId);
  //   const updatedCards = [...filteredCards, card];
  //   setDefaultSet({
  //     ...defaultSet,
  //     updatedCards
  //   })
  // }

  useEffect(() =>
    console.log(defaultSet)
  , [defaultSet])

  return (
    <>
      <Typography variant="h2" style={{ margin: "0.5em 0 0.5em 0.3em" }}>
        Create a new set
      </Typography>
      <ToastContainer />
      <Grid container spacing={2} style={{ marginLeft: "0.5em", width:'90%' }}>
        <Grid item md={2} >
          <Input
            placeholder="Enter set title"
            value={defaultSet.setName}
            name="setName"
            onChange={handleChange}
          />
        </Grid>
        <Grid item md={10} >
          <Input
            placeholder="Assign to folder"
            value={defaultSet.inFolder}
            name="inFolder"
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {
          defaultSet.cards.map((card, index) =>{
            return (
              <Grid item xs={12} key={card.id}>
            <Flashcard
            deleteCardFromDefaultSet={deleteCardFromDefaultSet}
            updateCardInDefaultSet={updateCardInDefaultSet}
              term={card.term}
              setId={defaultSet.setId}
              index={index}
              definition={card.definition}
              currentFolder={defaultSet.inFolder}
              defaultSet = {defaultSet}
              setDefaultSet={setDefaultSet}
              setName={defaultSet.setName}
              cardId={card.id}
              key={card.id}
              validateCard={validateCard}
              initialValueForValid={false}
              page="create"
            />
          </Grid>)
          })
        }
      </Grid>
      <Fab
        color="secondary"
        size="medium"
        aria-label="add"
        style={{ marginLeft: "1em" }}
      >
        <AddIcon onClick={() => addEmptyCard()} />
      </Fab>
    </>
  );
};

export default CreatePage;
