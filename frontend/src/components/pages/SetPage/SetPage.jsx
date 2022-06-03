import React, { useState, useEffect } from "react";
import Set from "../../Set/Set";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Fab, Typography, useMediaQuery } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./SetPage.css";
import { AppContext } from "../../Context/Context";
import { useContext } from "react";
import Spinner from '../../Spinner/Spinner';

const SetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCards, getSet } = useContext(AppContext);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));


  const [cardsinSet, setCardsInSet] = useState([]);
  const [setName, setSetName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(id)
    setLoading(true)
    getSet(id, setSetName);
  }, []);

  useEffect(() => {
    if (setName) {
      fetchCards(setName, setCardsInSet);
      setLoading(false);
    }
  }, [setName]);

  if(loading) return <Spinner/>

  return (
    <>
      {cardsinSet ? (
        <>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "1em 1em 0 1em" }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <div className="heading-wrapper">
            <div className="heading-container">
              <Typography
                variant="h1"
                m={4}
                xs={{ textAlign: "center", fontWeight: 500 }}
                className={isSmallScreen? "sm-screen-set-page-heading": "set-page-heading"}
              >
                {setName}
              </Typography>
              <Link to={`/${id}/edit`}>
                <Fab className="edit-icon" size="small" aria-label="add">
                  <EditIcon />
                </Fab>
              </Link>
            </div>
          </div>
          <Set set={cardsinSet} />
        </>
      ) : (
        <h1>Set not found</h1>
      )}
    </>
  );
};

export default SetPage;
