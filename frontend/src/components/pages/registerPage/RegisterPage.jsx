import React, { useState, useEffect } from "react";
import FormControlUnstyled from "@mui/base/FormControlUnstyled";
import InputLabel from "@mui/material/InputLabel";
import { Button, FormHelperText, Input } from "@mui/material";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username:"",
    email: "",
    password: "",
  });

  const handleClick =async(e)=>{
      e.preventDefault()
      try{
        const newUser = await axios.post('http://localhost:8000/auth/register', formData)
        console.log(newUser)
      }catch(e){
        console.log(e);
      }
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormControlUnstyled>
        <InputLabel htmlFor="my-input">First name</InputLabel>
        <Input
          name="first_name"
          value={formData.first_name}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          id="my-input"
          aria-describedby="my-helper-text"
        />
        <InputLabel htmlFor="my-input">Last name</InputLabel>
        <Input
          name="last_name"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          id="my-input"
          aria-describedby="my-helper-text"
        />
        <InputLabel htmlFor="my-input">Username</InputLabel>
        <Input
          name="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          id="my-input"
          aria-describedby="my-helper-text"
        />
        <InputLabel type="email" htmlFor="my-input">
          Email address
        </InputLabel>
        <Input
          name="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          id="my-input"
          aria-describedby="my-helper-text"
        />
        <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
        <InputLabel htmlFor="my-input">Password</InputLabel>
        <Input
          name="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          type="password"
          id="my-input"
          aria-describedby="my-helper-text"
        />
      </FormControlUnstyled>
      <Button variant="contained" color="primary" onClick={(e)=>handleClick(e)}>Register</Button>
    </div>
  );
};

export default RegisterPage;
