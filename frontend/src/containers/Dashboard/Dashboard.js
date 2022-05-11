import { Card, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import * as Loader from "react-loader-spinner";
import { useNavigate } from 'react-router-dom';
import { get_student_by_id } from '../../actions/user.js';
import SectionCourseInfo from "../../components/SectionInfo/SectionCourseInfo";
import SectionInstructorInfo from "../../components/SectionInfo/SectionInstructorInfo";
import StudentCurriculum from "../../components/StudentCurriculum/StudentCurriculum";
import StudentProfile from "../../components/StudentProfile/StudentProfile";
import StudentStatistics from "../../components/StudentStatistics/StudentStatistics";
import "./Dashboard.scss";

export default function Dashboard() {
  const [student, setStudent] = useState();
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [instructor, setInstructor] = useState();
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
  }, []);

  useEffect(() => {
    if (section) {
      setInstructor(section.section.instructors)
    }
  }, [section]);

  const changeSectionHandler = (newSection) => {
    setSection(newSection)
  }

  return (
    <Box sx={{ mx: 28, my: 3 }}> {student ? <Grid container spacing={0} columnSpacing={3}>
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
          component={StudentStatistics}
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
          lg={12} /> {section ?
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
                course={course}
                instructor={instructor}
                lg={6} />
              {instructor && <Grid
                item
                component={SectionInstructorInfo}
                section={section}
                instructor={instructor}
                lg={6} />}
            </Grid> :
            <Grid
              item
              lg={12}>
              <Card sx={{ backgroundColor: "white", width: "100%", height: 350, boxShadow: "none" }} />
            </Grid>}

      </Grid>

    </Grid> : <div className="loader">
      <Loader.ThreeDots color="black" height={120} width={120} />
    </div>}
    </Box>
  );
}