import { Grid, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import * as Loader from "react-loader-spinner";
import { useNavigate } from 'react-router-dom';
import { get_student_by_id } from '../../actions/user.js';

export default function Instructors() {
    const [student, setStudent] = useState();
    let navigate = useNavigate();

    useEffect(() => {
        get_student_by_id(localStorage.getItem("user_id")).then(
            response => {
                setStudent(response.data);
            }
        ).catch((error) => {
            console.log(error.response.data)
            localStorage.removeItem("user_id");
            navigate("/");
        })
    }, [])

    const viewInstructorDetails = () => {
        navigate("details")
    }

    return (
        <Box sx={{ mx: 3, my: 3 }}> {student ? <Grid container spacing={0} columnSpacing={3} rowGap={3}>
            {/* Top Row Container, each item container can be adjusted for width by changing lg*/}
            <Grid item container lg={3} justifyContent="center">
                <Grid item component={Box} lg={12} sx={{ backgroundColor: "powderblue", height: "700px" }}> Search Filters </Grid>
            </Grid>
            <Grid item container lg={9} justifyContent="center">
                <Grid item component={Box} lg={12} sx={{ backgroundColor: "crimson", height: "900px" }}> Instructor List </Grid>
            </Grid>
            <Grid item container lg={2} justifyContent="center">
                <Grid item component={Button} lg={12} onClick={viewInstructorDetails}> Details </Grid>
            </Grid>
        </Grid> : <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />

        </div>
        }</Box >
    );
}