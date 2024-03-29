import axios from "axios";

export const checkAuth = async () => {
  const response = await axios.get(
    "https://shilo.onrender.com/auth/check-auth",
    { withCredentials: true }
  );
  console.log(response);
  const isAuth = response.data;
  return isAuth;
};

export const login = async (credentials) => {
  const response = await axios({
    method: "post",
    url: "https://shilo.onrender.com/auth/login",
    data: credentials,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  console.log(response.data);
  const { isAuth } = response.data;
  if (!isAuth) {
    const { info } = response.data;
    return { isAuth, message: info.message };
  }
  return { isAuth };
};

export const logout = async () => {
  // const response = await axios.delete('http://localhost:8000/auth/logout')
  const response = await axios.get("https://shilo.onrender.com/auth/logout", {
    withCredentials: true,
  });
  return response.data;
};

export const register = async (userData, cb) => {
  try {
    const newUser = await axios.post(
      "https://shilo.onrender.com/auth/register",
      userData
    );
    if (newUser.data === "User already exists") {
      return cb(newUser.data);
    } else {
      return "success";
    }
  } catch (e) {
    console.log(e);
  }
};
