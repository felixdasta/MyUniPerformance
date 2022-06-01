import React from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@mui/material';
import { signup } from '../../actions/authentication.js'
import * as Loader from "react-loader-spinner";
import './ChangePassword.scss'

export default function ChangePassword() {
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

    const getErrors = (num) => {
        let result = [];
        if (num == 0) {
            if (userData.year_of_admission && userData.year_of_admission < 2016) {
                result.push(<p className="error-message">{"Year of admission must be greater or equal than 2016."}</p>)
            }
            if (userData.year_of_admission && userData.year_of_admission > 2021) {
                result.push(<p className="error-message">{"Year of admission must be less or equal than 2021."}</p>)
            }
        }
        else {
            for (let i = 0; i < errors.length; i++) {
                if (errors[i][0] == num) {
                    result.push(<p className="error-message">{errors[i][1]}</p>)
                }
            }
        }
        return result;
    }

    const inputChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    if (loggedInUser) {
        return <Navigate to="/dashboard" />
    }
    else if (loading) {
        return (<div className="loader" >
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>)
    }
    else {
        return (
            <div className="create-account-page">
                <div className="form">
                    <form className="register-form">
                        <input type="text" name="institutional_email" placeholder="Email" value={userData.institutional_email} onChange={inputChange} />
                        <Button onClick={() => {
                            setLoading(true);
                            signup(userData).then(response => {
                                setLoading(false);
                                alert("The password reset link has been sent to your email.")
                                navigate("/login");
                            }).catch((error) => {
                                setLoading(false);
                                setErrors(error.response.data)
                            });

                        }}>Change Password</Button>
                    </form>
                </div>
            </div>
        );
    }
}
