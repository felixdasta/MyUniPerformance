import React from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import {useState} from 'react';
import {Button, TextField} from '@mui/material';
import {signup} from '../../actions/authentication.js'
import * as Loader from "react-loader-spinner";
import './SignUp.scss'

export default function SignUp() {
  let navigate = useNavigate();
  let loggedInUser = localStorage.getItem("user");
  
  const [loading, setLoading] = useState();
  const [errors, setErrors] = useState([])
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    year_of_admission: "",
    institutional_email: "",
    password: "",
  });

  const getErrors= (num) => {
    let result = [];
    if(num == 0){
      if(userData.year_of_admission && userData.year_of_admission < 2016){
        result.push(<p className="error-message">{"Year of admission must be greater or equal than 2016."}</p>)
      }
      if(userData.year_of_admission && userData.year_of_admission > 2021){
        result.push(<p className="error-message">{"Year of admission must be less or equal than 2021."}</p>)
      }
    }
    else{
        for (let i = 0; i < errors.length; i++){
          if(errors[i][0] == num){
            result.push(<p className="error-message">{errors[i][1]}</p>)
          }
      }
    }
    return result;
  }

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
        <div className="create-account-page ">
          <div className="form">
            <form className="register-form">
              <input type="text" name="first_name" placeholder="First Name" value={userData.first_name} onChange={inputChange}/>
              <input type="text" name="last_name" placeholder="Last Name" value={userData.last_name} onChange={inputChange}/>
              <input type="number" name="year_of_admission" min="2016" max="2021" placeholder="Year of Admission" value={userData.year_of_admission} onChange={inputChange}/>
              {getErrors(0)}
              <input type="text" name="institutional_email" placeholder="Institutional Email" value={userData.institutional_email} onChange={inputChange}/>
              {getErrors(1)}
              <input type="password" name="password" placeholder="Password" value={userData.password} onChange={inputChange}/>
              {getErrors(2)}
              <Button onClick={() => {
                if(userData.year_of_admission >= 2016 && userData.year_of_admission <= 2021){
                  setLoading(true);
                  signup(userData).then(response => {
                    setLoading(false);
                    alert("Account has been created! Please check your email to activate your account.")
                    navigate("/login");
                }).catch((error) => {
                  setLoading(false);
                  setErrors(error.response.data)
                });
                }
            }}>Create</Button>
              <p className="message">Already registered? <a onClick = {() => navigate("/login") }>Sign In</a></p>
            </form>
          </div>
        </div>
    ); 
    } 
}
