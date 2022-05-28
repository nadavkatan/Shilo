import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { AppContext } from "../Context/Context";
import ItemsDisplay from '../itemsDisplay/ItemsDisplay';
import Spinner from '../Spinner/Spinner';

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
         { existingSets.length > 0 && <ItemsDisplay items={existingSets} itemSort={"set"} title={"Sets"} />}
         { existingFolders.length > 0 && <ItemsDisplay items={existingFolders} itemSort={"folders"} title={"Folders"} />}
    </>
          )
}
    </>
  );
};

export default Home;
