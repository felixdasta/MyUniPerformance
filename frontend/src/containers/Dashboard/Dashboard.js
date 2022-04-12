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
          lg={12} />
        <Grid
          item
          container
          lg={12}>
          <Grid className="placeholder" item lg={6}>
            <Typography align="center"> Selected Course </Typography>
          </Grid>
          <Grid className="placeholder" item lg={6}>
            <Typography align="center"> Professor </Typography>
          </Grid>
        </Grid>
      </Grid>

    </Grid> : <div className="loader">
      <Loader.ThreeDots color="black" height={120} width={120} />
    </div>}</Box>
  );
}
