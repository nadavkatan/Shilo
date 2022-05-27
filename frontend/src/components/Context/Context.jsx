import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom'
import {checkAuth, login, logout, register} from './utils/auth';

export const AppContext = createContext();

const Context = ({children}) => {

  const [existingSets, setExistingSets] = useState([]);
  const [existingFolders, setExistingFolders] = useState([]);
  const [isAuth, setIsAuth] = useState(undefined);
  const [currentUser, setCurrentUser] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [authMessage, setAuthMessage] = useState("")
  

  const navigate = useNavigate()
  const location = useLocation();

    const value= {
         isAuth,
        //  register,
         setIsAuth,
         authMessage,
         currentUser,
         currentLocation,
         existingSets,
         existingFolders,
         updateCardInDefaultSet: (cardId, term, definition, defaultSet, setDefaultSet)=>{
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
          },
           fetchSets: async()=>{
            await axios.post('http://localhost:8000/set/all', {username: currentUser})
            .then(res=>{
              setExistingSets(res.data)
            })
          },
          removeCardFromSet: async(setName, folder, cardId)=>{
            await axios.put('http://localhost:8000/set/remove-card', {username: currentUser, name: setName, folder: folder, update: cardId})
          },
          deleteSet: async(id)=>{
            await axios.delete('http://localhost:8000/set', {
              data: {
                id: id
              }
            })
          },
          checkIfCardsLeft: async(setName, folder)=>{
           const set = await axios.post('http://localhost:8000/set/one', { name: setName, folder: folder, username: currentUser})
           console.log(set)
           console.log(set.data[0]._id);
           if(!set.data[0].cards.length){
              console.log("no cards left in set")
            await axios.delete('http://localhost:8000/set', {
              data: {
                id: set.data[0].setId
              }
            });
            value.removeSetFromFolder(folder, setName);
           }
          },
          removeSetFromFolder: async(folder, set)=>{
            await axios.put('http://localhost:8000/folders/remove-set', {username: currentUser, folder: folder, update: set})
          },
          deleteFolder: async(folder)=>{
            await axios.delete('http://localhost:8000/folders',{
              data:{
                username: currentUser,
                folder: folder
              }
            })
          },
          addNewFolder: async(folder, set, username)=>{
            const newFolder = await axios.post('http://localhost:8000/folders',{"folder_name": folder, "user": username ,"sets": [set]});
            return newFolder
          }, 
          getAllFolders: async()=>{
            const folders = await axios.post('http://localhost:8000/folders/all', {username: currentUser})
            .then(res=>{
             const filtered = res.data.filter(folder=>{
                if(folder.sets.length){
                  return folder
                }else{
                value.deleteFolder(folder.folder_name)
                }
              });
              setExistingFolders(filtered)
            })
          },
          getFolderByName: async(folderName)=>{
            const folder = await axios.post('http://localhost:8000/folders/one', {"folder_name": folderName});
            return folder;
          },
          updateFolder: async(oldName, newName, newSet)=>{
            const update = {
              "folder": oldName,
              "update": {
                   "folder_name": newName,
                    "set": newSet
                  }
            }
            const updateFolder = await axios.put('http://localhost:8000/folders', update);

            return updateFolder
          },
          handleRegister: async(formData, cb)=>{
            const attempt = await register(formData, cb);
            if(attempt === "success") { 
              console.log("success");
              // setIsAuth(true);
            navigate("/");
            }
          },
          handleLogin: async(credentials)=>{
            // const response = await login(credentials);
            const {isAuth, message} = await login(credentials);
            // setIsAuth(response);
            setAuthMessage(message);
            setIsAuth(isAuth);
            if(message !=="No user with that username" || message !== "Incorrect password"){
              setCurrentUser(credentials.username);
              navigate('/')
            }
          },
          handleLogout: async()=>{
            console.log("test")
           const res = await logout();
           console.log(res)
            // setIsAuth(false);
            setIsAuth(res);
            navigate("/login");
          }
    }

    const checkAuthentication=  async()=>{
      const response = await checkAuth();
      console.log(response);
      setCurrentUser(response.user);
      setIsAuth(response.isAuth);
    }

    useEffect(()=>{
      console.log("checking authentication...");
      checkAuthentication()
      setCurrentLocation(location);
    },[])

    useEffect(()=>{
      console.log(currentUser)
    },[currentUser])

    useEffect(()=>{
      console.log(authMessage);
    },[authMessage])

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}

export default Context