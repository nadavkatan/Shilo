import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import {useLocation, useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";
import {checkAuth, login, logout, register} from './utils/auth';

export const AppContext = createContext();

const Context = ({children}) => {

  const [existingSets, setExistingSets] = useState([]);
  const [existingFolders, setExistingFolders] = useState([]);
  const [isAuth, setIsAuth] = useState(undefined);
  const [currentUser, setCurrentUser] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  
  const BASE_URL = process.env.REACT_APP_BASE_URL

  const navigate = useNavigate()
  const location = useLocation();

    const value= {
         isAuth,
         setIsAuth,
         authMessage,
         currentUser,
         currentLocation,
         existingSets,
         existingFolders,
         addNewCard: async(card)=>{
          await axios.post(`${BASE_URL}/create`, card);
         },
          fetchCards: async(setName, cb)=>{
          let cards = await axios.post(`${BASE_URL}/cards/in-set`, {setName:setName});
          cb(cards.data);
         },
          editCard: async(cardId, currentTerm, currentDefinition)=>{
          const updatedCard = await axios.put(`${BASE_URL}/cards`,{id:cardId, update:{term: currentTerm, definition: currentDefinition}})
          console.log(updatedCard);
        },
         validateCard: (card, currentFolder)=>{
          if(card.set && currentFolder){
          console.log("successful validation")
          console.log("set" , card.setName, "currentFolder", currentFolder)
          return true
          }
          if(!card.set){
            toast.error("Card must be assigned to set")
            return false
          }
          if(!currentFolder){
           toast.error("Card must be assigned to folder")
           return false
          }
        },
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
          addNewSet: async(card, currentFolder, setId)=>{
            const newSet= await axios.post(`${BASE_URL}/set`, {set_name:card.set, inFolder: currentFolder, setId:setId, user: currentUser, cards:[card.id]});
            console.log("context, new set",newSet);
            const set_id = newSet.data.set._id;
            console.log(set_id)
            return set_id
          },
           fetchSets: async()=>{
            await axios.post(`${BASE_URL}/set/all`, {username: currentUser})
            .then(res=>{
              setExistingSets(res.data)
            })
          },
           getSet: async(id,cb)=>{
            const set = await axios.get(`${BASE_URL}/set/${id}`);
            console.log(set)
            cb(set.data.set_name)
          },
          updateSet: async(setName,currentFolder,card )=>{
            await axios.put(`${BASE_URL}/set`, {user: currentUser, name: setName, folder:currentFolder,  update: card.id});
          },
          removeCardFromSet: async(setName, folder, cardId)=>{
            await axios.put(`${BASE_URL}/set/remove-card`, {username: currentUser, name: setName, folder: folder, update: cardId})
          },
          deleteSet: async(id)=>{
            await axios.delete(`${BASE_URL}/set`, {
              data: {
                id: id
              }
            })
          },
          checkIfCardsLeft: async(setName, folder)=>{
           const set = await axios.post(`${BASE_URL}/set/one`, { name: setName, folder: folder, username: currentUser})
           console.log(set)
           console.log(set.data[0]._id);
           if(!set.data[0].cards.length){
              console.log("no cards left in set")
            await axios.delete(`${BASE_URL}/set`, {
              data: {
                id: set.data[0].setId
              }
            });
            value.removeSetFromFolder(folder, setName);
           }
          },
          removeSetFromFolder: async(folder, set)=>{
            await axios.put(`${BASE_URL}/folders/remove-set`, {username: currentUser, folder: folder, update: set})
          },
          deleteFolder: async(folder)=>{
            await axios.delete(`${BASE_URL}/folders`,{
              data:{
                username: currentUser,
                folder: folder
              }
            })
          },
          addNewFolder: async(folder, set, username)=>{
            const newFolder = await axios.post(`${BASE_URL}/folders`,{"folder_name": folder, "user": username ,"sets": [set]});
            return newFolder
          }, 
           addOrUpdateFolder: async(currentFolder, setName)=>{
            let existingFolder = await value.getFolderByName(currentFolder);
            console.log(existingFolder);
            if(!existingFolder.data){
              console.log("folder is not in db")
              value.addNewFolder( currentFolder, setName, currentUser)
            }else{
              console.log('folder already in db')
              value.updateFolder(currentFolder, currentFolder, setName);
            }
          },
          getAllFolders: async()=>{
            const folders = await axios.post(`${BASE_URL}/folders/all`, {username: currentUser})
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
            const folder = await axios.post(`${BASE_URL}/folders/one`, {"folder_name": folderName});
            return folder;
          },
           getFolderById: async(folderId, cb)=>{
            const folder = await axios.get(`${BASE_URL}/folders/${folderId}`);
            cb(folder.data)
          },
          updateFolder: async(oldName, newName, newSet)=>{
            const update = {
              "folder": oldName,
              "update": {
                   "folder_name": newName,
                    "set": newSet
                  }
            }
            const updateFolder = await axios.put(`${BASE_URL}/folders`, update);

            return updateFolder
          },
          handleRegister: async(formData, cb)=>{
            const attempt = await register(formData, cb);
            if(attempt === "success") { 
            navigate("/");
            }
          },
          handleLogin: async(credentials)=>{
            const {isAuth, message} = await login(credentials);
            setAuthMessage(message);
            setIsAuth(isAuth);
            if(message !=="No user with that username" || message !== "Incorrect password"){
              setCurrentUser(credentials.username);
              navigate('/')
            }
          },
          handleLogout: async()=>{
           const res = await logout();
            setIsAuth(res);
            navigate("/login");
          }
    }

    const checkAuthentication=  async()=>{
      const response = await checkAuth();
      setCurrentUser(response.user);
      setIsAuth(response.isAuth);
    }

    useEffect(()=>{
      checkAuthentication()
      setCurrentLocation(location);
    },[])

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}

export default Context