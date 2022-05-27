import * as React from 'react';
import {useEffect, useContext} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {AppContext} from '../../Context/Context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

export default function SignUp() {

    const [formData, setFormData] = React.useState({
        first_name: "",
        last_name: "",
        username:"",
        email:"",
        password: "",
      });
      const [message, setMessage] = React.useState("");
      const [formMessage, setFormMessage] = React.useState("")

      const {handleRegister} = useContext(AppContext);

      const errorToast = (message)=>{
        toast.error(message);
      }

      const validateForm =()=>{
        if(!formData.first_name.length){
           setFormMessage("Please fill in your first name")
           return false
        };
        if(!formData.last_name.length){
         setFormMessage("Please fill in your last name");
          return false
        }
        if(!formData.username.length){
         setFormMessage("Please fill in your username");
         return false
         }
        if(!formData.email.includes('@')) {
         setFormMessage("A compatible email address must be provided");
         return false
         }
        if(formData.password.length < 7){
         setFormMessage("Password must have at least 8 characters.");
         return false
         }

        return true
      }

  const handleSubmit = async(event) => {
    event.preventDefault();
   const valid = validateForm();
   if(valid){
     console.log('valid')
    handleRegister(formData, setMessage);
   }

  }


  useEffect(()=>{
    if(message === "User already exists"){
      errorToast(message)
    }
  },[message])

  useEffect(()=>{
    if(formMessage){
      errorToast(formMessage)
    }
  },[formMessage])



  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <ToastContainer />
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={e=> setFormData({...formData, [e.target.name]: e.target.value})}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="last_name"
                  onChange={e=> setFormData({...formData, [e.target.name]: e.target.value})}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  onChange={e=> setFormData({...formData, [e.target.name]: e.target.value})}
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  onChange={e=> setFormData({...formData, [e.target.name]: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  onChange={e=> setFormData({...formData, [e.target.name]: e.target.value})}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}