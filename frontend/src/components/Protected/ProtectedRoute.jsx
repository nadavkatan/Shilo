import { DotSpinner } from "@uiball/loaders";
import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../Context/Context";
import Spinner from '../Spinner/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(AppContext);

  useEffect(() => {
    console.log("isAuth is ", isAuth);
  }, [isAuth]);

  if (isAuth === undefined || isAuth === null) {
    return <Spinner />
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
