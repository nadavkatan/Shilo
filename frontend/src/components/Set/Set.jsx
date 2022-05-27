import { Button, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import React, { useEffect, useState } from "react";
import "./Set.css";
import parse from 'html-react-parser';
import axios from "axios";


const Set = ({ set }) => {
  const [flipped, setFlipped] = useState(false);

  const flippCard = () => {
    flipped ? setFlipped(false) : setFlipped(true);
  };

  return (
    <Carousel
      autoPlay={false}
      className="carousel"
      next={(next, active) => setFlipped(false)}
      prev={(prev, active) => setFlipped(false)}
    >
      {set.map((card, index) => {
        return (
          <div key={index} className="flashcard">
            {flipped ? (
              <div className="card-side">
                {card.defImgSrc ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      width: "100%",
                    }}
                  >
                    <div style={{ width: "50%" }}><Typography variant="h6">{parse(card.definition)}</Typography></div>
                    <div style={{ width: "50%" }}>
                      <img
                      loading="lazy"
                        src={card.defImgSrc}
                        alt={card.definition}
                        style={{
                          width: "8em",
                          height: "8em",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div><Typography variant="h6">{parse(card.definition)}</Typography></div>
                )}
              </div>
            ) : (
              <div className="card-side">
                <div><Typography variant="h6">{parse(card.term)}</Typography></div>
              </div>
            )}
            <Button className="CheckButton" onClick={flippCard}>
              {flipped ? "Got it!" : "Check it out!"}
            </Button>
          </div>
        );
      })}
    </Carousel>
  );
};

export default Set;
