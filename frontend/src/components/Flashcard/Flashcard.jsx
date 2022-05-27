import {
  CircularProgress,
  Divider,
  Fab,
  Grid,
  InputLabel,
  Paper,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./Flashcard.css";
import axios from "axios";
import ImagesBox from "../ImagesBox/ImagesBox";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from '@nadavkatan/ckeditor5-custom-build';
import { AppContext } from "../Context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";


const Flashcard = ({
  term,
  index,
  setId,
  deleteCardFromDefaultSet,
  updateCardInDefaultSet,
  definition,
  currentFolder,
  cardId,
  setName,
  defaultSet, 
  setDefaultSet
}) => {
  const [currentTerm, setCurrentTerm] = useState(term);
  const [currentDefinition, setcurrentDefinition] = useState(definition);
  const [curentImgSrc, setCurrentImgSrc] = useState("");
  const [doneEditing, setDoneEditing] = useState(false);
  const [suggestedImgs, setSuggestedImgs] = useState([]);
  const [showImgBox, setShowImgBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mongoCardId, setMongoCardId] = useState("");
  const [cards, setCards] = useState([]);

  const {addNewFolder,getFolderByName, updateFolder, currentUser, removeCardFromSet, checkIfCardsLeft} = useContext(AppContext);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));


  const fetchCards = async(setName)=>{
     let cards = await axios.post('http://localhost:8000/cards/in-set', {setName:setName});
     setCards(cards.data);
    }

    const editCard = async(cardId)=>{
      const updatedCard = await axios.put('http://localhost:8000/cards',{id:cardId, update:{term: currentTerm, definition: currentDefinition}})
      console.log(updatedCard);
    }
  
  const addOrUpdateFolder = async()=>{
    let existingFolder = await getFolderByName(currentFolder);
    console.log(existingFolder);
    if(!existingFolder.data){
      console.log("folder is not in db")
      addNewFolder( currentFolder, setName, currentUser)
    }else{
      console.log('folder already in db')
      //updateFolder
      updateFolder(currentFolder, currentFolder, setName);
    }
  }

  const handleUpdate = async() => {
    //Get all the sets, and then check if the current set exists in the database
    // let sets = await axios.get('http://localhost:8000/set');
    let sets = await axios.post('http://localhost:8000/set/all', {username: currentUser});
    console.log(sets);
    let existing = sets.data.filter(set=> set.set_name === setName && set.inFolder === currentFolder);
    console.log(existing)
    
    // If the set exists in db
    if(existing.length){
      console.log('set exists in database');
      //updateFolder

      //Check if the cards exists in the set, if they don't, update create new card in the db and update cards array in the set in the db
      if(!cards.some(card=> card.id === cardId.toString())){
        console.log('card not in set')

        let card ={
          set: setName,
          term: currentTerm,
          definition: currentDefinition,
          id: cardId.toString(),
          defImgSrc: curentImgSrc,
        }

        await axios.post("http://localhost:8000/create", card);
        await axios.put("http://localhost:8000/set", {user: currentUser, name: setName, folder:currentFolder,  update: card.id});
        updateCardInDefaultSet(cardId, currentTerm, currentDefinition, defaultSet, setDefaultSet)
        fetchCards(setName);
      }else{
        console.log('card already in set');
        editCard(cardId)
      }

    }else{
      console.log("set does not exist in db");
      //check if folder exists
      addOrUpdateFolder()
      let newCard ={
        set: setName,
        term: currentTerm,
        definition: currentDefinition,
        id: cardId.toString(),
        defImgSrc: curentImgSrc,
      }
       const mongoCard = await axios.post("http://localhost:8000/create", newCard);
       setMongoCardId(mongoCard.data.card._id)
     const newSet= await axios.post("http://localhost:8000/set", {set_name:newCard.set, inFolder: currentFolder, setId:setId, user: currentUser, cards:[newCard.id]});
    //  const newSet= await axios.post("http://localhost:8000/set", {set_name:newCard.set, inFolder: currentFolder, setId:setId, cards:[newCard.id]});
     console.log(newSet);
        updateCardInDefaultSet(cardId, currentTerm, currentDefinition)
        fetchCards(setName);
    }

    // Edit mode is set to false
    setDoneEditing(true);
    // Images box is set to false, which will unmount the ImageBox element
    setShowImgBox(false);
  };

  // handle delete card request
  const handleDelete = async() => {
   axios.delete('http://localhost:8000/cards', {
    data: {
      id: cards[index]._id
    }
  });
   removeCardFromSet(setName, currentFolder, cardId)
  deleteCardFromDefaultSet(cardId)
  checkIfCardsLeft(setName, currentFolder)
  };

  // set the current image to a selected image from the ImagesBox
  const selectImg = (imgSrc) => {
    setCurrentImgSrc(imgSrc);
  };

  // fetch images that correspond to the user's inserted term from unsplash api 
  const fetchImages = async (searchQuery) => {
    if (showImgBox) {
      setShowImgBox(false);
    } else {
      setShowImgBox(true);
      setIsLoading(true)
      try{
        // const API_KEY = "L92Pp9wkJO2kEWKKMLqXZUN2XLW_mjzig97HmRiAscY";
        const API_KEY = process.env.REACT_APP_UNSPLAH_API_KEY;
        const API_URL = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=5&client_id=${API_KEY}`;
       const images = await axios.get(API_URL);
       console.log(images)
       setSuggestedImgs([...images.data.results]);
      setIsLoading(false)
      }catch(err){
        console.log(err);
        setIsLoading(false)
      }
    }
  };

  useEffect(() => {
    fetchCards(setName);
  },[])

  useEffect(() => {
    console.log(suggestedImgs);
  }, [suggestedImgs]);

  useEffect(() => {
    console.log(cards);
  }, [cards]);


  useEffect(() => {
    console.log(curentImgSrc);
  }, [curentImgSrc]);


  return (
    <Grid item xs={12} style={{ margin: "1em" }}>
      <Paper
        style={{
          height: "12em",
          display: "flex",
          alignItems: "center",
          backgroundColor: doneEditing ? "lightgrey" : "white",
        }}
        elevation={3}
      >
        <Grid container>
        {
          !isSmallScreen &&         
           <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              style={{
                width: "96%",
                margin: "0 auto",
                padding: "0.5em",
                fontWeight: "bold",
                color: "grey",
              }}
            >
              {index + 1}
            </Typography>
            <Divider style={{ width: "96%", margin: "0 auto" }} />
          </Grid>
        }

          <Grid item xs={12}>
            <Grid container>
              <Grid className="edit-input" item xs={5}>
              <CKEditor
                    editor={ Editor }
                    data={currentTerm}
                    onReady={ editor => {
                        // console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        // console.log( { event, editor, data } );
                        setCurrentTerm(data);
                    } }
                    onFocus={ ( event, editor ) => {
                        // console.log( 'Focus.', editor );
                        setDoneEditing(false);
                    } }
                />
                <InputLabel
                  style={{ borderTop: "1px solid lightgrey" }}
                  htmlFor={term}
                >
                  Term
                </InputLabel>
              </Grid>
              <Grid className="edit-input" item xs={5}>
              <CKEditor
                    editor={ Editor }
                    data={currentDefinition}
                    onReady={ editor => {
                        // console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        // console.log( { event, editor, data } );
                        setcurrentDefinition(data);
                    } }
                    onFocus={ ( event, editor ) => {
                        // console.log( 'Focus.', editor );
                        setDoneEditing(false);
                    } }
                />
                <InputLabel
                  style={{ borderTop: "1px solid lightgrey" }}
                  htmlFor={definition}
                >
                  Definition
                </InputLabel>
              </Grid>
              <Grid
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                item
                xs={1}
              >
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <Fab
                      style={{ margin: "1em 0" }}
                      color="error"
                      size="small"
                      aria-label="edit"
                    >
                      <DeleteForeverIcon onClick={handleDelete} />
                    </Fab>
                    <Fab color="primary" size="small" aria-label="edit" >
                      <DoneIcon onClick={handleUpdate} />
                    </Fab>
                    {
                      isSmallScreen &&                  
                          <Fab color="success" size="small" style={{ margin: "1em 0" }}>
                       <ImageIcon className="img-icon" onClick={() => {
                        fetchImages(currentTerm)
                        }}
                        disabled={isLoading}
                        />
                    </Fab>

                    }
                  </Grid>
                  <Grid item xs={12} sm={6}>
                  {
                    isSmallScreen ? null

                    :
                    <div
                      className="img-icon-container"
                      onClick={() => {
                        fetchImages(currentTerm)
                        }}
                        disabled={isLoading}
                    >
                      <ImageIcon className="img-icon" />
                      <p style={{ fontSize: "0.8em" }}>IMAGE</p>
                    </div>
                  }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      {showImgBox ? (
        isLoading ?  <CircularProgress /> : <ImagesBox images={suggestedImgs} selectImg={selectImg} />
      ) : null}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </Grid>
  );
};

export default Flashcard;
