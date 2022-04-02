import { Typography, Container, Grid } from "@mui/material";
import { Box, maxWidth } from "@mui/system";
import { get_student_by_id } from '../../actions/user.js'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Loader from "react-loader-spinner";
import StudentProfile from "../../components/StudentProfile";
import StudentCurriculum from "../../components/StudentCurriculum";
import StudentStats from "../../components/StudentStats/StudentStats.js"
import "./Dashboard.scss"

export default function Dashboard() {
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
    <Box sx={{ mx: 3 }}> {student ? <Grid container spacing={3}>
      <Grid item lg={3}>
        <div className="wrapper">
          <StudentProfile student={student} />
        </div>
      </Grid>
      <Grid item lg={9}>
        <div className="wrapper">
          <Typography sx={{ fontSize: 36, mb: 1 }} align="center">
            Spring Semester 2022 {/* will be dynamic, just placeholder for styling */}
          </Typography>
          <StudentCurriculum student={student} />
        </div>
      </Grid>
      <Grid item lg={3}>
        <Typography align="center"> Student Stats </Typography>
        <StudentStats student={student} />
      </Grid>
      <Grid item container lg={9} spacing={0}>
        <Grid item lg={6}>
          <div className="placeholder">
            <Typography align="center"> Selected Course </Typography>
          </div>
        </Grid>
        <Grid item lg={6}>
          <div className="placeholder">
            <Typography align="center"> Professor </Typography>
          </div>
        </Grid>
      </Grid>
    </Grid> : <div className="loader">
      <Loader.ThreeDots color="black" height={120} width={120} />
    </div>}</Box>
  );
}
