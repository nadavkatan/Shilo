import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {AppContext} from '../Context/Context';

const ProtectedRoute = ({children}) => {

    const {isAuth, currentLocation} = useContext(AppContext);

    useEffect(()=>{
       console.log("isAuth is ", isAuth) 
    },[isAuth]);

    if(isAuth === undefined || isAuth === null){
        return <div>Loading...</div>
    }

    if(!isAuth){
      // return currentLocation.pathname === "/register"?  <Navigate to="/register" replace/> : <Navigate to="/login" replace/> 
      return <Navigate to="/login" replace/> 
    }

  return children
}

export default ProtectedRoute