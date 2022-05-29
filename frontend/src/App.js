import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import FolderPage from "./components/pages/FolderPage/FolderPage";
import SetPage from "./components/pages/SetPage/SetPage";
import "./App.css";
import EditPage from "./components/pages/EditPage/EditPage";
import CreatePage from "./components/pages/CreatePage/CreatePage";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignupPage from "./components/pages/registerPage/SignupPage";
import SignInPage from './components/pages/SignInPage/SignInPage';
import Context from "./components/Context/Context";
import ProtectedRoute from './components/Protected/ProtectedRoute'

function App() {
  //create Mui theme
  const theme = createTheme({
    typography: {
      fontFamily: "Oswald",
    },
  });

  const location = useLocation();

  return (
    <Context>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header />
          <CssBaseline />
          <Routes>
          <Route path="/register" element={ <SignupPage/>}/>
          <Route path="/login" element={<SignInPage/>} />
            
            <Route path="/" element={<ProtectedRoute>
            <Home/>
            </ProtectedRoute>} />

            <Route path="/create" element={<ProtectedRoute>
              <CreatePage />
            </ProtectedRoute> } />
            <Route path="/:id/edit" element={<EditPage />} />
            <Route path="/folder/:id" element={<FolderPage />} />
            <Route path="/:id" element={<SetPage key={location.pathname} />}/>


          </Routes>
          
        </div>
      </ThemeProvider>
    </Context>

  );
}

export default App;
