import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Link, useNavigate } from 'react-router-dom';
import {AppContext} from '../Context/Context';

export default function Searchbar() {

  const {existingSets} = useContext(AppContext);
  const [options, setOptions] = useState([]);

    const navigate = useNavigate();

    const getSetId = (option)=>{
      let set = existingSets.find(set=> set.set_name === option);
      let id = set._id;
      return id;
    }

    useEffect(()=>{
      if(existingSets.length){
        setOptions(
          existingSets.map(set=>{
            return set.set_name
          }))
      }
    },[existingSets]);

    useEffect(()=>{
      console.log(options)
    },[options])

  return (
    <>
    {
      options.length? 
      <Autocomplete
      id="country-select-demo"
      sx={{ width: 300 }}
      options={options}
      autoHighlight
      renderOption={(props, option) => (
          
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} onClick={()=>{navigate(`/${getSetId(option)}`)}}>
         <Link style={{ textDecoration: 'none', color: 'black'}} to={`/${getSetId(option)}`}>{option}</Link> 
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a study set"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    /> : null
    }
</>

  );
}