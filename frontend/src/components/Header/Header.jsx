import React, { useContext } from "react";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";
import "./Header.css";
import { Link } from "react-router-dom";
import { Button, Grid } from "@mui/material";
import SearchBar from "../SearchBar/SearchBar";
import { AppContext } from "../Context/Context";
import TemporaryDrawer from "../Drawer/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";

const Header = ({ data }) => {
  const { handleLogout, isAuth } = useContext(AppContext);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <header>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} className="logo-container">
          <SchoolIcon color="action" />
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography className="shilo-logo" color="white" variant="h4">
              Shilo
            </Typography>
          </Link>
        </Grid>
        {isAuth && (
          <>
            {!isSmallScreen ? (
              <>
                <Grid
                  item
                  xs={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <SearchBar data={data} />
                </Grid>
                <Grid
                  style={{ display: "flex", justifyContent: "flex-end" }}
                  item
                  xs={4}
                >
                  <Link to="/create" style={{ textDecoration: "none" }}>
                    {" "}
                    <Button
                      style={{ marginLeft: "1em" }}
                      variant="contained"
                      color="primary"
                    >
                      {" "}
                      Create study set
                    </Button>
                  </Link>
                  <TemporaryDrawer />
                </Grid>
              </>
            ) : (
              <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
              <TemporaryDrawer />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </header>
  );
};

export default Header;
