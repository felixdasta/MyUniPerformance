import * as React from 'react';
import {Box, Card, CardActions, CardContent, Button, Typography, Icon} from '@mui/material'
import { createTheme } from '@mui/system';
import Avatar from '@mui/material/Avatar';
import { ThemeProvider } from '@emotion/react';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useQuery } from "react-query";

function StudentProfile(props){

    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [yearOfAdmin, setYearofAdmin] = useState("")
    const [institEmail, setInstitEmail] = useState("")


    const userQuery = useQuery("user", async () => {
        const { data } = await axios.get(
            'http://127.0.0.1:8000/students/37b03faa-4725-458d-aebb-8f7399102508'
            );
        setName(data.first_name);
        setLastName(data.last_name);
        setYearofAdmin(data.year_of_admission);
        setInstitEmail(data.institutional_email)
        return data;
    });
    
    if(userQuery.isLoading){
        console.log("Query is loading")
        return(
            <div>
                <Typography>Loading...</Typography>
            </div>
        );
    }else{
        return (
            <Card sx={{ minWidth: 500}}>
                <CardContent>
                    <Typography sx={{ fontSize: 36}}>
                        {name} {lastName}
                    </Typography>
                    <Icon>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                    </Icon>
                    <Typography sx={{ fontSize: 18}}>
                        Name: {name} {lastName}
                    </Typography>
                    <Typography sx={{ fontSize: 18}}>
                        Year of Admission: {yearOfAdmin}
                    </Typography>
                    <Typography sx={{ fontSize: 18}}>
                        Institutional Email: {institEmail}
                    </Typography>
                    <Typography sx={{ fontSize: 18}}>
                        Credits:
                    </Typography>
                </CardContent>
            </Card>
        );
    }
} export default StudentProfile;