import React from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import {useState} from 'react';
import {login,send_activation_email} from '../../actions/authentication.js'
import {Button} from '@mui/material';
import * as Loader from "react-loader-spinner";
import './Login.scss'

export default function Login() {
  let navigate = useNavigate();
  let loggedInUser = localStorage.getItem("user_id");
  
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [activation, setActivation] = useState();
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
            <form className="login-form">
              {error && <p className="error-message">{error}</p>}
              {activation && <p className="activation-message">Didn't received activation email? 
                      <a onClick = { () => send_activation_email({"institutional_email": userData.institutional_email}).then(response => {
                        alert(response.data.message)
                      }) 
                      }> Send activation email</a></p>}
              <input type="text" name="institutional_email" placeholder="Email" value={userData.institutional_email} onChange={inputChange}/>
              <input type="password" name="password" placeholder="Password" value={userData.password} onChange={inputChange}/>
              <Button onClick={() => {
                setLoading(true);
                login(userData).then( response => {
                  setLoading(false);
                  localStorage.setItem("user_id", response.data.user_id);
                  navigate("/dashboard");
              }).catch((error) => {
                let message = error.response.data.error
                setError(message)
                setLoading(false);
                if(message.includes("verify")){
                  setActivation(true);
                }
                else{
                  setActivation(false);
                }
              });

            }}>Sign In</Button>
              <p className="message">Not registered? <a onClick = {() => navigate("/create-account") }>Create an account</a></p>
            </form>
          </div>
        </div>
    ); 
    } 
}
