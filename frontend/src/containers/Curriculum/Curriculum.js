import React, { useEffect, useState } from "react";
import { Card, Grid } from "@mui/material";
import { Box } from "@mui/system";
import * as Loader from "react-loader-spinner";
import { useNavigate } from 'react-router-dom';
import { get_student_by_id, get_university_by_id } from '../../actions/user.js';
import CurriculumTable from "../../components/CurriculumTable/CurriculumTable.js";
import CurriculumInfo from "../../components/CurriculumInfo/CurriculumInfo.js";

export default function Curriculum() {
    const [student, setStudent] = useState();
    const [university, setUniversity] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        get_student_by_id(localStorage.getItem("user_id")).then(
            response => {
                let curriculum = response.data.curriculums[0]
                setStudent(response.data);
                get_university_by_id(curriculum.department.university).then(
                    response => {
                        setUniversity(response.data)
                    }
                ).catch((error) => {
                    console.log(error.response.data)
                    navigate("/")
                })
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
                <Grid item component={Box} lg={12} sx={{ backgroundColor: "peachpuff", height: "700px" }}> Course List </Grid>
            </Grid>
            <Grid item container lg={9} direction={"column"} rowGap={3}>
                <Grid item component={CurriculumTable} student={student} university={university} lg={12} sx={{ backgroundColor: "salmon", height: "800px" }}> Curriculum </Grid>
                <Grid item component={CurriculumInfo} student={student} university={university} lg={12} sx={{ backgroundColor: "burlywood", height: "350px" }}> Curriculum info </Grid>
            </Grid>
        </Grid> : <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />

        </div>
        }</Box >
    );
}