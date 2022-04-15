import { Container, Box } from '@mui/material';
import * as React from 'react';

function StudentStats(props) {
    let student = props.student;
    return (
        <Container sx={{ backgroundColor: "orange" }}>
            <Box height={700}>
                Student Stats
            </Box>
        </Container>
    )
} export default StudentStats;