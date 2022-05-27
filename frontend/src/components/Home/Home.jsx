import { Grid, Paper, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import "./Home.css";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import {AppContext} from '../Context/Context';


const Home = ({ data }) => {

  const [cards, setCards] = useState();
  const {existingSets,existingFolders, fetchSets, getAllFolders, isAuth, currentUser} = useContext(AppContext);

  const navigate = useNavigate()

  const fetchCards = async()=>{
    await axios.get('http://localhost:8000/cards')
    .then(res=>{
      setCards(res.data)
    })
  }  

  useEffect(() => {
    if(!isAuth){
      navigate("/register");
    }
   fetchSets()
   getAllFolders()
  },[])


  useEffect(() => {
    console.log(isAuth)
  },[isAuth])
  useEffect(() => {
    console.log(currentUser)
  },[currentUser])

  return (
    <>
    {existingSets.length?
    <>
      <Typography mt={6} className="home-headings" variant="h6">
        Your Sets
      </Typography>
      <Grid container spacing={4} style={{padding:'1em'}}>
        {existingSets.length
          ? existingSets.map((set) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={uuidv4()}
                >
                  <Link
                    to={`/${set._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Paper className="paper" elevation={3} style={{ minHeight: "6em", cursor: "pointer" }}>
                      <Typography variant="h4" sx={{ textAlign: "center" }}>
                        {set.set_name}
                      </Typography>
                      <Typography variant="subtitle1">
                        {set.cards.length} terms
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              );
            })
          : null}
      </Grid>
      <Typography className="home-headings" variant="h6" mt={10}>
        Your Folders
      </Typography>
      <Grid container spacing={4} style={{padding:'1em'}}>
        {existingFolders.length
          ? existingFolders.map((folder) => {
              return (
                <Grid
                className="grid"
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={uuidv4()}
                >
                  <Link to={`/folder/${folder._id}`} style={{ textDecoration: "none" }}>
                    <Paper className="paper" elevation={3}  style={{ minHeight: "6em", cursor: "pointer" }}>
                      <Typography variant="h4" sx={{ textAlign: "center" }}>
                        {folder.folder_name}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              );
            })
          : null}
      </Grid>
      </>
      :
      <>
      <Typography mt={6} sx={{ fontWeight: 500, textAlign: "center" }} className="home-headings" variant="h3">
        Start creating you card sets and boost your learning experience!
      </Typography>       
      </>
    }
    </>
  );
};

export default Home;
