import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@nadavkatan/ckeditor5-custom-build';
import { Grid, InputLabel } from '@mui/material';
import './TextArea.css';

const TextArea = ({currentVal, setCurrentVal, setDoneEditing, label}) => {
  return (
    <Grid className="textarea-editor" item xs={12} md={5}>
    <CKEditor
          editor={ Editor }
          data={currentVal}
          onReady={ editor => {
          } }
          onChange={ ( event, editor ) => {
              const data = editor.getData();
              setCurrentVal(data);
          } }
          onFocus={ ( event, editor ) => {
              setDoneEditing(false);
          } }
      />
      <InputLabel
        style={{ borderTop: "1px solid lightgrey" }}
        // htmlFor={term}
      >
        {label}
      </InputLabel>
    </Grid>
  )
}

export default TextArea