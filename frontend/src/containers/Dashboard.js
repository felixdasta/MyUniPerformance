import React from "react";
import { Typography, Container, Grid } from '@mui/material'
import StudentProfile from '../components/StudentProfile'
import UserCurriculum from '../components/UserCurriculum';
import { Query, QueryClient, QueryClientProvider } from "react-query";

export default function Dashboard() {
    const queryClient = new QueryClient();
    const queryClient2 = new QueryClient(); //TOCHANGE
    return (
        <main>
            <QueryClientProvider client={queryClient}>
                <Grid container spacing={3}>
                    <Grid item container sx={{ my: 15, mx: 5 }}>
                        <UserCurriculum />
                    </Grid>
                </Grid>
            </QueryClientProvider>
            <QueryClientProvider client={queryClient2}>
                <Grid container spacing={3}>
                    <Grid item container sx={{ my: 15, mx: 5 }}>
                        <StudentProfile />
                    </Grid>
                </Grid>
            </QueryClientProvider>
        </main>
    );
}