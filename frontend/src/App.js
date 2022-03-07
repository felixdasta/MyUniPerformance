import React from 'react';
import {Typography, Container, Grid } from '@mui/material'
import StudentProfile from './components/StudentProfile'
import UserCurriculum from './components/UserCurriculum';
import {Query, QueryClient, QueryClientProvider} from "react-query";
import { Link } from 'react-router-dom';

function App() {

  const queryClient = new QueryClient();

  return (

    <div className="App">
      <QueryClientProvider client={queryClient}>
      <Typography>Student Profile View</Typography>
        <body>
          <Grid container spacing={3}>
            <Grid item container sx={{my:15, mx:5}}>
              <UserCurriculum/>
            </Grid>
          </Grid>    
        </body>
        </QueryClientProvider>
    <div>
      <h1>Sandunga</h1>
      <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}

export default App;
