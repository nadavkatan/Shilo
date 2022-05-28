import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  Grid,
  Typography,
  Fab,
  Button,
} from "@mui/material";
import Flashcard from "../../Flashcard/Flashcard";
import axios from "axios";
import {AppContext} from '../../Context/Context';

const EditPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const{deleteSet, removeSetFromFolder, getFolderByName, deleteFolder} = useContext(AppContext);
  
  const [setName, setSetName] = useState("");
  const [currentSet, setCurrentSet] = useState();
  const [cardsInset, setCardsInSet] = useState([])
  const [defaultSet, setDefaultSet] = useState({
    setName: "",
    setId: "",
    inFolder: "",
    cards: [],
  });

    // get the name of the set form the url params
  const getSet = async()=>{
    const set = await axios.get(`http://localhost:8000/set/${id}`);
    console.log(set)
      setCurrentSet(set.data)
      setSetName(set.data.set_name)
  }

  const fetchCards = async(setName)=>{
   let cards = await axios.post('http://localhost:8000/cards/in-set', {setName:setName});
   console.log(cards);
   setCardsInSet(cards.data);
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
  const deleteCardFromDefaultSet = (cardId)=>{
    setDefaultSet((prev) => {
      return {
        ...prev,
        cards: defaultSet.cards.filter(card => card.id !== cardId)
      };
    });
  }

  const addEmptyCard = async() => {
   let newCard = {
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
  }

  useEffect(()=>{
    getSet(id);
  },[]);

  useEffect(()=>{
    setDefaultSet((prev)=>{
      return{
        ...prev,
        cards: cardsInset
      }
    })
  },[cardsInset]);

  useEffect(()=>{
    if(setName){
      fetchCards(setName);
      setDefaultSet((prev)=>{
        return{
          ...prev, 
          setName: setName,
          setId: currentSet.setId,
          inFolder: currentSet.inFolder
        }
      })
    }
  },[setName])

  useEffect(()=>{
    console.log(defaultSet)
  },[defaultSet])

  return (
    <>
    <Grid container>
    <Grid item xs={6}>
    <Typography variant="h2" style={{  margin: "0.5em", fontWeight: '500' }}>Edit {setName}</Typography>
    </Grid>
    <Grid item xs={5} style={{display: 'flex', justifyContent: 'flex-end',alignItems: 'center'}}>
          <Button color="primary" variant="contained" onClick={() => defaultSet.cards.length? navigate(-1) : navigate("/")}>
            Back
          </Button>
    </Grid>
    </Grid>
      <Grid container spacing={2}>
        {
          defaultSet.cards.length > 0 &&  defaultSet.cards.map((card, index) => {
          return (
            <Flashcard
              key={card.id}
              setId={defaultSet.setId}
              updateCardInDefaultSet={updateCardInDefaultSet}
              deleteCardFromDefaultSet={deleteCardFromDefaultSet}
              index={index}
              term={card.term}
              definition={card.definition}
              currentFolder={defaultSet.inFolder}
              setName={defaultSet.setName}
              cardId={card.id}
            />
          );
        })}
      </Grid>
      <Fab style={{marginLeft:'1em'}} color="secondary" size="medium" aria-label="add">
          <AddIcon onClick={() => addEmptyCard()} />
        </Fab>
    </>
  );
};

export default EditPage;