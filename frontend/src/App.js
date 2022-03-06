import React from 'react';
import {Typography, Container, Grid } from '@mui/material'
import StudentProfile from './components/StudentProfile'
import './App.css';
import {Query, QueryClient, QueryClientProvider} from "react-query";

function App() {

  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
      <Typography>Student Profile View</Typography>
        <body>
          <Grid container spacing={3}>
            <Grid item container sx={{my:15, mx:5}}>
              <StudentProfile/>
            </Grid>
          </Grid>  
        </body>
        </QueryClientProvider>
    </div>
  );
}

export default App;
