import React from 'react';
import {Paper} from "@mui/material";
import './ImagesBox.css';

const ImagesBox = ({images, selectImg}) => {

// store the image that the user selected in a state
    const handleSelect=(e, imgSrc)=>{
        selectImg(imgSrc);
        let img = e.target;
        img.style.border = '3px solid yellow';
    }

  return (
    <div className="images-box">
    <Paper>
    <div className="images-container">
    {images.map(image =>{
        return <img key={image.id} id={image.id} src={image.urls.small} onClick={(e)=>handleSelect(e, image.urls.raw)} alt={image.alt_description} style={{width: '10em', height: '10em', margin:'1em', borderRadius: '10px', cursor: 'pointer'}}/>
    })}
    </div>
    </Paper>
    </div>
  )
}

export default ImagesBox