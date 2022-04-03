import * as React from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Table } from '@mui/material';

function StudentCurriculum(props) {
    let student = props.student;

    //Defining styles for table
    if(student.curriculums) {
        let result = []
        for(let i = 0; i < student.curriculums.length; i++){
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
                            {(student.curriculums[i].courses).map((courseData) => (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    key={courseData.course.course_id}
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

        return result;
    }

} export default (StudentCurriculum);