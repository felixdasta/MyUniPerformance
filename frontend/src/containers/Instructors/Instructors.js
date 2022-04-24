import { Grid } from "@mui/material";
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

    return (
        <Box sx={{ mx: 3, my: 3 }}> {student ? <Grid container spacing={0} columnSpacing={3} rowGap={3}>
            {/* Top Row Container, each item container can be adjusted for width by changing lg*/}
            <Grid item container lg={12} justifyContent="center" columnSpacing={3}>
                <Grid item container lg={4} justifyContent="center">
                    <Grid item component={Box} lg={12} sx={{ backgroundColor: "salmon", height: "250px" }}> Instructor info </Grid>
                </Grid>
                <Grid item container lg={4} justifyContent="center">
                    <Grid item component={Box} lg={12} sx={{ backgroundColor: "powderblue", height: "200px" }}> Image and feedback button </Grid>
                </Grid>
                <Grid item container lg={4} justifyContent="center">
                    <Grid item component={Box} lg={12} sx={{ backgroundColor: "lime", height: "400px" }}> Quick facts </Grid>
                </Grid>
            </Grid>

            {/* Bottom Row Container */}
            <Grid item container lg={12} justifyContent="center">
                <Grid item component={Box} lg={7} sx={{ backgroundColor: "blueviolet", height: "350px" }}> Course list </Grid>
                <Grid item component={Box} lg={5} sx={{ backgroundColor: "navajowhite", height: "350px" }}> Course info </Grid>
            </Grid>
        </Grid> : <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />

        </div>}</Box>
    );
}