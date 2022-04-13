import React from "react";
import { Typography, Modal, Grid } from "@mui/material";
import { Box, maxWidth } from "@mui/system";
import { get_student_by_id } from '../../actions/user.js'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Loader from "react-loader-spinner";
import StudentProfile from "../../components/StudentProfile";
import StudentCurriculum from "../../components/StudentCurriculum";
import StudentStats from "../../components/StudentStats/StudentStats";
import SectionCourseInfo from "../../components/SectionInfo/SectionCourseInfo";
import SectionProfInfo from "../../components/SectionInfo/SectionProfInfo";
import "./Dashboard.scss"

export default function Dashboard() {
  const [student, setStudent] = useState();
  const [section, setSection] = useState();
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

  useEffect(() => {
  }, [section])

  const changeSectionHandler = (data) => {
    setSection(data)
  }

  return (
    <Box sx={{ mx: 3, my: 3 }}> {student ? <Grid container spacing={0} columnSpacing={3}>
      {/* Container for student information */}
      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        lg={3}
        rowGap={3}>
        <Grid
          item
          component={StudentProfile}
          student={student}
          lg={12} />
        <Grid
          item
          component={StudentStats}
          student={student}
          lg={12} />
      </Grid>

      {/* Container for curriculum information */}
      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        lg={9}
        rowGap={3}>
        <Grid
          item
          component={StudentCurriculum}
          student={student}
          changeSection={changeSectionHandler}
          lg={12} />
        <Grid
          item
          container
          direction="row"
          justifyContent="center"
          lg={12}>
          <Grid
            item
            component={SectionCourseInfo}
            section={section}
            lg={6} />
          <Grid
            item
            component={SectionProfInfo}
            section={section}
            lg={6} />
        </Grid>
      </Grid>

    </Grid> : <div className="loader">
      <Loader.ThreeDots color="black" height={120} width={120} />

    </div>}</Box>
  );
}
