import React from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import {useState} from 'react';
import {login} from '../../actions/authentication.js'
import {Button} from '@mui/material';
import * as Loader from "react-loader-spinner";
import './Login.scss'

export default function Login() {
  let navigate = useNavigate();
  let loggedInUser = localStorage.getItem("user");
  
  const [loading, setLoading] = useState();
  const [error, setError] = useState()
  const [userData, setUserData] = useState({
    institutional_email: "",
    password: "",
  });

  const inputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

    if(loggedInUser){
      return <Navigate to="/dashboard" />
    }
    else if(loading){
      return (<div className = "loader" >
        <Loader.ThreeDots color="black" height={120} width={120} />
      </div>)
    }
    else{
      return (
        <div className="login-page">
          <div className="form">
            <form className="register-form">
              <input type="text" placeholder="name"/>
              <input type="password" placeholder="password"/>
              <input type="text" placeholder="email address"/>
              <button>create</button>
              <p className="message">Already registered? <a href="#">Sign In</a></p>
            </form>
            <form className="login-form">
              {error && <p className="error-message">{error}</p>}
              <input type="text" name="institutional_email" placeholder="Email" value={userData.institutional_email} onChange={inputChange}/>
              <input type="password" name="password" placeholder="Password" value={userData.password} onChange={inputChange}/>
              <Button onClick={() => {
                setLoading(true);
                login(userData).then( response => {
                  setLoading(false);
                  localStorage.setItem("user", JSON.stringify(response.data));
                  navigate("/dashboard");
              }).catch((error) => {
                setLoading(false);
                setError(error.response.data.error)
              });

            }}>Sign In</Button>
              <p className="message">Not registered? <a href="#">Create an account</a></p>
            </form>
          </div>
        </div>
    ); 
    } 
}
