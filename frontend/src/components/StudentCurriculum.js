import * as React from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Table } from '@mui/material';
import axios from 'axios';

function StudentCurriculum(props) {
    let student = props.student;

    //Defining styles for table
    if(student.enrolled_sections) {
        let result = []
            result.push(
                <TableContainer component={Paper} height="100vh">
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
                            {(student.enrolled_sections).map((courseData) => (
                                
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    key={courseData.section.course.course_name}
                                >
                                    <TableCell component="th" scope='row'>
                                        {courseData.section.course.course_name}
                                    </TableCell>
                                    <TableCell align='right'>{courseData.section.course.course_code}</TableCell>
                                    <TableCell align='right'>{courseData.section.course.course_credits}</TableCell>
                                    <TableCell align='right'>{courseData.section.course.department.department_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        return result;
    }

} export default (StudentCurriculum);