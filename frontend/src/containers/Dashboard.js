import React from "react";
import { Typography, Container, Grid } from "@mui/material";
import StudentProfile from "../components/StudentProfile";
import UserCurriculum from "../components/UserCurriculum";
import { QueryClient } from "react-query";
import { Box, maxWidth } from "@mui/system";

export default function Dashboard() {
    return (
        <Box sx={{ mx: 3 }}>
            <Grid container spacing={3}>
                <Grid item lg={3}>
                    <StudentProfile />
                </Grid>
                <Grid item lg={9}>
                    <UserCurriculum />
                </Grid>
                <Grid item lg={3}>
                    <Box sx={{
                        backgroundColor: 'lightgray',
                        height: 350,
                        width: 350,
                    }}>
                        <Typography align="center">
                            Student Stats
                        </Typography>
                    </Box>
                </Grid>
                <Grid item container lg={9} spacing={0}>
                    <Grid item lg={6}>
                        <Box sx={{
                            backgroundColor: 'lightgray',
                            height: 350,
                            width: maxWidth,
                        }}>
                            <Typography align="center">
                                Selected Course
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item lg={6}>
                        <Box sx={{
                            backgroundColor: 'lightgray',
                            height: 350,
                            width: maxWidth,
                        }}>
                            <Typography align="center">
                                Professor
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
