import { Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {AppContext} from '../../Context/Context';

const FolderPage = () => {

  const {fetchSets, existingSets, getFolderById} = useContext(AppContext);
  const {id} = useParams();
  const navigate = useNavigate();

  const [currentFolder, setCurrentFolder] = useState();
  const [ids, setIds] = useState([]);

  useEffect(() => {
    getFolderById(id, setCurrentFolder);
  },[]);

  useEffect(() => {
    fetchSets()
  },[currentFolder])

  useEffect(()=>{
    if(existingSets.length && currentFolder){
      setIds(currentFolder.sets.map(set=>{
        let id = existingSets.find(existingSet => existingSet.set_name === set);
        return id._id
      }));
    }
  },[existingSets])

  useEffect(()=>{
    console.log(ids)
  },[ids])

  return (
    <>
    {
      currentFolder && 
      <>
      <Button variant="contained" color="primary" style={{margin:'1em'}} onClick={()=> navigate(-1)}>Back</Button>
      <Typography variant="h3" style={{textAlign: 'center', marginTop: '0.5em'}}>Sets in {currentFolder.folder_name}</Typography>
      <Grid container spacing={2} style={{display: 'flex', justifyContent: 'center'}}>
        {currentFolder.sets.map((set, index) => {
          return (
            <Grid style={{ margin: "2em" }} item xs={12} sm={3} key={uuidv4()}>
              <Link
                to={`/${ids[index]}`}
                style={{ textDecoration: "none" }}
              >
                <Paper style={{ minHeight: "6em", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Typography variant="h4">
                    {set}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          );
        })}
      </Grid>
      </>
    }
    </>
  );
};

export default FolderPage;
