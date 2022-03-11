import React from "react";
import { Typography, Container, Grid } from '@mui/material'
import StudentProfile from '../components/StudentProfile'
import UserCurriculum from '../components/UserCurriculum';
import { Query, QueryClient, QueryClientProvider } from "react-query";

export default function Dashboard() {
    const queryClient = new QueryClient();
    const queryClient2 = new QueryClient(); //TOCHANGE
    return (
        <Grid container spacing={3}>
            <Grid item container lg={3}>
                <QueryClientProvider client={queryClient2}>
                    <StudentProfile />
                </QueryClientProvider>
            </Grid>
            <Grid item container lg={9}>
                <QueryClientProvider client={queryClient}>
                    <UserCurriculum />
                </QueryClientProvider>
            </Grid>
        </Grid>
    );
}