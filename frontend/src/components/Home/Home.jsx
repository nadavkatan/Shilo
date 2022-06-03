import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { AppContext } from "../Context/Context";
import ItemsDisplay from '../itemsDisplay/ItemsDisplay';
import Spinner from '../Spinner/Spinner';
import { Paper, Typography } from "@mui/material";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const {
    existingSets,
    existingFolders,
    fetchSets,
    getAllFolders,
    isAuth,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const initializeHome = () => {
    setLoading(true);
    fetchSets();
    getAllFolders();
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/register");
    }
    initializeHome();
  }, []);
  return (
    <>
{
  loading ? <Spinner />
        : (
        <>
         { existingSets.length > 0 ? <ItemsDisplay items={existingSets} itemSort={"set"} title={"Sets"} /> :       <>
      <div className="invitation-wrapper">
      <Paper elevation={3} className="invitation-container">
      <Typography className="invitation" variant="h3">Create Shilo flashcards and boost you learning experience!</Typography>
      </Paper>

      <Paper elevation={3} className="invitation-container">
        <Typography variant="h3" className="invitation">
        <Link className="invitation-link" to={'/create'}>
        Click here to create your first set!
        </Link>
        </Typography>
      </Paper>
      </div>

      </>}
         { existingFolders.length > 0 && <ItemsDisplay items={existingFolders} itemSort={"folders"} title={"Folders"} />}
    </>
          )
}
    </>
  );
};

export default Home;
