import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AppContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FolderSharedIcon from "@mui/icons-material/FolderShared";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });
  const [showFolders, setShowFolders] = React.useState(false);

  const { currentUser, isAuth, handleLogout, existingFolders } =
    React.useContext(AppContext);
  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.target.name === "folders" &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const FoldersList = () => {
    return (
      <List>
        {existingFolders.length > 0 &&
          existingFolders.map((folder) => {
            return (
              <ListItem
                disablePadding
                key={folder._id}
                onClick={() => {
                  setState({right: false})
                  navigate(`/folder/${folder._id}`)
                  }}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={folder.folder_name} />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    );
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List>
        <ListItem
          disablePadding
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <ListItemButton onClick={() => navigate("/create")}>
            <ListItemIcon>
              <AddToPhotosIcon />
            </ListItemIcon>
            <ListItemText primary={"Create a study set"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          onClick={() => setShowFolders((prev) => !prev)}
          name="folders"
        >
          <ListItemButton>
            <ListItemIcon>
              <FolderSharedIcon />
            </ListItemIcon>
            <ListItemText primary={"Your folders"} />
          </ListItemButton>
        </ListItem>
        {showFolders && <FoldersList />}
        <ListItem
          disablePadding
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {isAuth && (
        <>
          {["right"].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>
                <AccountCircleIcon />
                {currentUser}
              </Button>
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
}
