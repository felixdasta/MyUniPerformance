import { Typography, Container, Grid } from "@mui/material";
import { Box, maxWidth } from "@mui/system";
import {get_student_by_id} from '../actions/user.js'
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import StudentProfile from "../components/StudentProfile";
import StudentCurriculum from "../components/StudentCurriculum";
import StudentStatistics from "../components/StudentStatistics/StudentStatistics.js";
import * as Loader from "react-loader-spinner";

export default function Dashboard() {
    const [student, setStudent] = useState();
    let navigate = useNavigate();

    useEffect(()=> {
        get_student_by_id(localStorage.getItem("user_id")).then(
            response => {
                setStudent(response.data);
            }
        ).catch((error) => { 
                console.log(error.response.data)
                localStorage.removeItem("user_id"); 
                navigate("/"); 
        });
    }, []);
    
    return (     
        <Box sx={{ mx: 3 }}> {student ? <Grid container spacing={3}>
            <Grid item lg={3}>
              <StudentProfile student={student} />
            </Grid>
            <Grid item lg={9}>
              <StudentCurriculum student={student} />
            </Grid>
            <Grid item lg={3}>
              <Box sx={{
                        backgroundColor: 'lightgray',
                        height: 350,
                        width: 350,
                    }}>
                <Typography align="center"> Student Statistics </Typography>
                <StudentStatistics student={student}/>
              </Box>
            </Grid>
            <Grid item container lg={9} spacing={0}>
              <Grid item lg={6}>
                <Box sx={{
                            backgroundColor: 'lightgray',
                            height: 350,
                            width: maxWidth,
                        }}>
                  <Typography align="center"> Selected Course </Typography>
                </Box>
              </Grid>
              <Grid item lg={6}>
                <Box sx={{
                            backgroundColor: 'lightgray',
                            height: 350,
                            width: maxWidth,
                        }}>
                  <Typography align="center"> Professor </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>: <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />
          </div>} </Box>
    );
}
