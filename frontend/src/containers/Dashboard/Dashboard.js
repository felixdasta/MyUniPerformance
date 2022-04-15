import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import * as Loader from "react-loader-spinner";
import { useNavigate } from 'react-router-dom';
import { get_student_by_id } from '../../actions/user.js';
import { get_section_info_by_id } from "../../actions/sections.js";
import SectionCourseInfo from "../../components/SectionInfo/SectionCourseInfo";
import SectionInstructorInfo from "../../components/SectionInfo/SectionInstructorInfo";
import StudentCurriculum from "../../components/StudentCurriculum";
import StudentProfile from "../../components/StudentProfile";
import StudentStats from "../../components/StudentStats/StudentStats";
import "./Dashboard.scss";

export default function Dashboard() {
  const [student, setStudent] = useState();
  const [universities, setUniversities] = useState();
  const [selectedUniversity, setSelectedUniversity] = useState();
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [instructor, setInstructor] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    get_student_by_id(localStorage.getItem("user_id")).then(
      response => {
        setStudent(response.data);
        let curriculums = response.data.curriculums;
        let universities = [];
        for (let i = 0; i < curriculums.length; i++) {
          let curriculum = curriculums[i];
          universities.push(curriculum.department.university);
        }
        setSelectedUniversity(universities[0]);
        setUniversities(universities);
      }
    ).catch((error) => {
      console.log(error.response.data)
      localStorage.removeItem("user_id");
      navigate("/");
    })
  }, [])

  useEffect(() => {
    if (section) {
      setSectionCourseInfo(section, setCourse);
      setSectionInstructor(section, setInstructor);
    }
  }, [section])

  const changeSectionHandler = (newSection) => {
    setSection(newSection)
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
                lg={6} />
              <Grid
                item
                component={SectionInstructorInfo}
                section={section}
                instructor={instructor}
                lg={6} />
            </Grid> :
            <h1>poop</h1>}

      </Grid>

    </Grid> : <div className="loader">
      <Loader.ThreeDots color="black" height={120} width={120} />

    </div>}</Box>
  );
}

function setSectionCourseInfo(selectedUniversity, section, setCourse) {

}

function setSectionInstructor(section, setInstructor) {
  get_section_info_by_id(section.section.section_id).then(
    response => {
      setInstructor(response.data.instructors)
    }
  ).catch((error) => {
    console.log(error);
  });
}