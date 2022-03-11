import React from "react";
import Navbar from "../components/Navbar";
import { Typography, Container, Grid } from "@mui/material";
import StudentProfile from "../components/StudentProfile";
import UserCurriculum from "../components/UserCurriculum";
import { Query, QueryClient, QueryClientProvider } from "react-query";
import { Box, maxHeight, maxWidth } from "@mui/system";

export default function Dashboard() {
    const queryClient = new QueryClient();
    const queryClient2 = new QueryClient(); //TOCHANGE
    return (
        <Box sx={{ mx: 3 }}>
            <Grid container spacing={3}>
                <Grid item lg={3}>
                    <QueryClientProvider client={queryClient2}>
                        <StudentProfile />
                    </QueryClientProvider>
                </Grid>
                <Grid item lg={9}>
                    <QueryClientProvider client={queryClient}>
                        <UserCurriculum />
                    </QueryClientProvider>
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
