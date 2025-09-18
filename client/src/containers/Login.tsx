import { useState } from "react";
import axios from "axios";
import { URL } from "../config.ts";
import { useNavigate } from "react-router";
// import jwt from 'jsonwebtoken'
// react-scripts from version 5 shipped with react 18 is not supporting jsonwebtoken so we need to use alternative like jose to decode the JWT token in the client
import * as jose from "jose";

interface LoginProps {
  login: (token: string) => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const [form, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/login`, {
        email: form.email.toLowerCase(),
        password: form.password,
      });
      setMessage(response.data.message);
      if (response.data.ok) {
        // here after login was successful we extract the email passed from the server inside the token
        const decodedToken = jose.decodeJwt(response.data.token);
        // and now we now which user is logged in in the client so we can manipulate it as we want, like fetching data for it or we can pass the user role -- admin or not -- and act accordingly, etc...
        console.log(
          "Email extracted from the JWT token after login: ",
          decodedToken.userEmail
        );
        setTimeout(() => {
          props.login(response.data.token);
          navigate("/tree-page");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="form_container"
    >
      <label>Email</label>
      <input name="email" onChange={handleChange} />
      <label>Password</label>
      <input name="password" onChange={handleChange} />
      <button>login</button>
      <div className="message">
        <h4>{message}</h4>
      </div>
    </form>
  );
};

export default Login;