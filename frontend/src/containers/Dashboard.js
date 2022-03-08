import React from "react";
import Navbar from "../components/Navbar";
import { Typography, Container, Grid } from "@mui/material";
import StudentProfile from "../components/StudentProfile";
import UserCurriculum from "../components/UserCurriculum";
import { Query, QueryClient, QueryClientProvider } from "react-query";

export default function Dashboard() {
  const queryClient = new QueryClient();
  const queryClient2 = new QueryClient(); //TOCHANGE
  return (
    <main>
      <Navbar />
      <Grid container justifyContent={"space-between"} direction={"row"}>
        <Grid item xs={1} sx={{mx:3, my:3}}>
          <QueryClientProvider client={queryClient2}>
            <StudentProfile />
          </QueryClientProvider>
        </Grid>
        <Grid item xs={6} sx={{mx:3, my:3}}>
          <QueryClientProvider client={queryClient}>
            <UserCurriculum />
          </QueryClientProvider>
        </Grid>
      </Grid>
    </main>
  );
}

