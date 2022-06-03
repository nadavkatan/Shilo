import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./Flashcard.css";
import axios from "axios";
import ImagesBox from "../ImagesBox/ImagesBox";
import { AppContext } from "../Context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextArea from "../TextArea/TextArea";
import { useEffect } from "react";

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
  setDefaultSet,
  validateCard,
  initialValueForValid,
  page,
}) => {
  const [currentTerm, setCurrentTerm] = useState(term);
  const [currentDefinition, setcurrentDefinition] = useState(definition);
  const [curentImgSrc, setCurrentImgSrc] = useState("");
  const [doneEditing, setDoneEditing] = useState(false);
  const [suggestedImgs, setSuggestedImgs] = useState([]);
  const [showImgBox, setShowImgBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cards, setCards] = useState([]);
  const [valid, setValid] = useState(initialValueForValid);

  const {
    addOrUpdateFolder,
    addNewSet,
    currentUser,
    removeCardFromSet,
    updateSet,
    checkIfCardsLeft,
    editCard,
    fetchCards,
    addNewCard,
  } = useContext(AppContext);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleUpdate = async () => {
    //Get all the sets, and then check if the current set exists in the database
    let sets = await axios.post(`${BASE_URL}/set/all`, {
      username: currentUser,
    });
    console.log(sets);
    let existing = sets.data.filter(
      (set) => set.set_name === setName && set.inFolder === currentFolder
    );
    console.log(existing);

    let card = {
      set: setName,
      term: currentTerm,
      definition: currentDefinition,
      id: cardId.toString(),
      defImgSrc: curentImgSrc,
    };

    // If the set exists in db
    if (existing.length) {
      console.log("set exists in database");

      //Check if the cards exists in the set, if they don't, update create new card in the db and update cards array in the set in the db
      if (!cards.some((card) => card.id === cardId.toString())) {
        console.log("card not in set");
        addNewCard(card);
        updateSet(setName, currentFolder, card);
        updateCardInDefaultSet(
          cardId,
          currentTerm,
          currentDefinition,
          defaultSet,
          setDefaultSet
        );
        fetchCards(setName, setCards);
      } else {
        console.log("card already in set");
        editCard(cardId, currentTerm, currentDefinition);
      }
    } else {
      console.log("set does not exist in db");
      console.log(card);
      //check if folder exists
      if (validateCard(card, currentFolder)) {
        console.log("valid");
        setValid(true);
        addOrUpdateFolder(currentFolder, setName);
        addNewCard(card);
        addNewSet(card, currentFolder, setId);
        updateCardInDefaultSet(cardId, currentTerm, currentDefinition);
        fetchCards(setName, setCards);
      } else {
        setValid(false);
      }
    }

    setDoneEditing(true);
    setShowImgBox(false);
  };

  // handle delete card request
  const handleDelete = async () => {
    await axios.delete(`${BASE_URL}/cards`, {
      data: {
        id: cards[index]._id,
      },
    });
    removeCardFromSet(setName, currentFolder, cardId);
    deleteCardFromDefaultSet(cardId);
    checkIfCardsLeft(setName, currentFolder);
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
      setIsLoading(true);
      try {
        // const API_KEY = "L92Pp9wkJO2kEWKKMLqXZUN2XLW_mjzig97HmRiAscY";
        const API_KEY = process.env.REACT_APP_UNSPLAH_API_KEY;
        const API_URL = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=5&client_id=${API_KEY}`;
        const images = await axios.get(API_URL);
        setSuggestedImgs([...images.data.results]);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log(defaultSet)
    console.log('fetching cards')
    fetchCards(setName, setCards);
  },[])

  useEffect(()=>{
    console.log(cards)
  },[cards])

  return (
    <Grid item xs={12} style={{ margin: "1em" }}>
      <Paper
        className="flashCardPaper"
        style={{
          backgroundColor: doneEditing && valid ? "lightgrey" : "white",
        }}
        elevation={3}
      >
        <Grid container>
          {!isSmallScreen && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" className="card-nr">
                {index + 1}
              </Typography>
              <Divider style={{ width: "96%", margin: "0 auto" }} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={12}
                md={10}
                className={
                  isSmallScreen
                    ? "sm-screen-textareas-container"
                    : "textareas-container"
                }
              >
                <TextArea
                  currentVal={currentTerm}
                  setCurrentVal={setCurrentTerm}
                  setDoneEditing={setDoneEditing}
                  label="Term"
                />
                <TextArea
                  currentVal={currentDefinition}
                  setCurrentVal={setcurrentDefinition}
                  setDoneEditing={setDoneEditing}
                  label="Definition"
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                className={
                  isSmallScreen ? "sm-screen-btns-container" : "btns-container"
                }
              >
                <Button
                  startIcon={<DoneIcon />}
                  variant="contained"
                  color="primary"
                  className="btn"
                  onClick={handleUpdate}
                >
                  {page === "create"
                    ? isSmallScreen
                      ? "Add"
                      : "Add to set"
                    : isSmallScreen
                    ? "Save"
                    : "Save edit"}
                </Button>
                <Button
                  startIcon={<ImageIcon />}
                  variant="contained"
                  color="success"
                  className="btn"
                  disabled={isLoading}
                  onClick={() => {
                    fetchImages(currentTerm);
                  }}
                >
                  {isSmallScreen ? "Image" : "Add image"}
                </Button>
                <Button
                  startIcon={<DeleteForeverIcon />}
                  variant="contained"
                  className="btn"
                  color="error"
                  onClick={handleDelete}
                >
                  {isSmallScreen ? "Delete" : "Delete card"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      {showImgBox ? (
        isLoading ? (
          <CircularProgress />
        ) : (
          <ImagesBox images={suggestedImgs} selectImg={selectImg} />
        )
      ) : null}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </Grid>
  );
};

export default Flashcard;
