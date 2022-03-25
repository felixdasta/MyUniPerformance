import * as React from 'react';
import Table from '@mui/material/Table'
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper } from '@mui/material';

function UserCurriculum() {
    let loggedInUser = JSON.parse(localStorage.getItem("user"));

    //Defining styles for table
    if(loggedInUser) {
        return (
            <TableContainer component={Paper} sx={{maxHeight: 350}}>
                <Table sx={{ minWidth: 350}} aria-label="simple table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell align='right'>Course Code</TableCell>
                            <TableCell align='right'>Credit Hours</TableCell>
                            <TableCell align='right'>Department Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(loggedInUser.curriculums[0].courses).map((courseData) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={courseData.course.course_name}
                            >
                                <TableCell component="th" scope='row'>
                                    {courseData.course.course_name}
                                </TableCell>
                                <TableCell align='right'>{courseData.course.course_code}</TableCell>
                                <TableCell align='right'>{courseData.course.course_credits}</TableCell>
                                <TableCell align='right'>{courseData.course.department.department_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

} export default (UserCurriculum);