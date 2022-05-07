import React, { useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import { Box } from "@mui/system";
import * as Loader from "react-loader-spinner";
import { useNavigate } from 'react-router-dom';
import { get_student_by_id } from '../../actions/user.js';
import CurriculumTable from "../../components/CurriculumTable/CurriculumTable.js";
import CurriculumInfo from "../../components/CurriculumInfo/CurriculumInfo.js";
import CurriculumCoursePicker from "../../components/CurriculumCoursePicker/CurriculumCoursePicker.js";

export default function Curriculum() {
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
            <Grid item container lg={3} justifyContent="center">
                <Grid item component={CurriculumCoursePicker} student={student} lg={12} />
            </Grid>
            <Grid item container lg={9} direction={"column"} rowGap={3}>
                <Grid item component={CurriculumTable} student={student} lg={12} />
                <Grid item component={CurriculumInfo} student={student} lg={12} />
            </Grid>
        </Grid> : <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />

        </div>
        }</Box >
    );
}