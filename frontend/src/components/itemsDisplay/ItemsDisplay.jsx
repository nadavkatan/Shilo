import { Grid, Paper, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";


const ItemsDisplay = ({items, itemSort, title}) => {

    const BASE_LINK = itemSort === "set"? "/" : "/folder/"
    
  return (
      <>
    <Typography mt={6} className="home-headings" variant="h6">
    {`Your ${title}`}
  </Typography>
  <Grid container spacing={4} style={{ padding: "1em" }}>
    {items.length
      ? items.map((item) => {
          return (
            <Grid item xs={12} sm={6} md={3} key={uuidv4()}>
              <Link
                to={`${BASE_LINK}${item._id}`}
                style={{ textDecoration: "none" }}
              >
                <Paper
                  className="paper"
                  elevation={3}
                  style={{ minHeight: "6em", cursor: "pointer" }}
                >
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    {
                        itemSort === "set"? item.set_name : item.folder_name 
                        }
                  </Typography>
                  <Typography variant="subtitle1">
                    {
                        itemSort === "set" ? item.cards.length === 1? `${item.cards.length} term` : `${item.cards.length} terms`
                        :  item.sets.length === 1? `${item.sets.length} set` : `${item.sets.length} sets` 

                        } 
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          );
        })
      : null}
  </Grid>
  </>
  )
}

export default ItemsDisplay