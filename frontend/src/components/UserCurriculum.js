import * as React from 'react';
import { Box, Card, CardActions, CardContent, Button, Typography, Icon } from '@mui/material'
import axios from "axios";
import { useState, useEffect } from 'react';
import { useQuery } from "react-query";
import Table from '@mui/material/Table'
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper } from '@mui/material';


function UserCurriculum(props) {

    const [payload, setPayload] = useState([])

    const userQuery = useQuery("user", async () => {

        const { data } = await axios.get(
            'http://127.0.0.1:8000/students/37b03faa-4725-458d-aebb-8f7399102508'
        )
        setPayload(data.curriculums[0]);
        console.log(data.curriculums[0])
        return data;
    })

    if (userQuery.isLoading) {
        console.log("Curriculum Query is Loading...")
        return (
            <div>
                <Typography>Loading...</Typography>
            </div>
        );
    } else {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell align='right'>Course Code</TableCell>
                            <TableCell align='right'>Course ID</TableCell>
                            <TableCell align='right'>Credit Hours</TableCell>
                            <TableCell align='right'>Department Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(payload.courses).map((courseData) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={courseData.course.course_name}
                            >
                                <TableCell component="th" scope='row'>
                                    {courseData.course.course_name}
                                </TableCell>
                                <TableCell align='right'>{courseData.course.course_code}</TableCell>
                                <TableCell align='right'>{courseData.course.course_id}</TableCell>
                                <TableCell align='right'>{courseData.course.course_credits}</TableCell>
                                <TableCell align='right'>{courseData.course.department.department_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

} export default UserCurriculum;