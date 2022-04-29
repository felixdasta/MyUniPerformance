import { React, useCallback } from 'react';
import { Button, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Table, Typography } from '@mui/material';
import axios from 'axios';

function StudentCurriculum(props) {
    let student = props.student;
    //Defining styles for table

    const sectionClickHandler = useCallback((section) => {
        return async (e) => {
            e.preventDefault()
            props.changeSection(section)
        }
    }, [])

    if (student.enrolled_sections) {
        let result = []
        result.push(
            <TableContainer component={Paper} height="100vh">
                <Typography sx={{ fontSize: 36, mb: 1 }} align="center">
                    Spring Semester 2022 {/* will be dynamic, just placeholder for styling */}
                </Typography>
                <Table sx={{ minWidth: 250 }} aria-label="enrolled courses" stickyHeader>
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
                                onClick={sectionClickHandler(courseData)}
                                hover={true}
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