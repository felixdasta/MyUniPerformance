import { React, useCallback,useEffect, useState } from 'react';
import { Button, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Table, Typography } from '@mui/material';

function StudentCurriculum(props) {
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [termValue, setTermValue] = useState();
    let student = props.student;
    //Defining styles for table

    const semesters = {
        "V1": "First Summer",
        "V2": "Second Summer",
        "S1": "Fall Semester",
        "S2": "Spring Semester",
    }

    const sectionClickHandler = useCallback((section) => {
        return async (e) => {
            e.preventDefault()
            props.changeSection(section)
        }
    }, [])

    const formatTerm = value => {
        let year = parseInt(value.substring(0, 4));
        let semester = value.substring(4);
        year = semester == "S2" ? year + 1 : year;
        semester = semesters[semester];
        return semester + " " + year;
    };

    useEffect(() => {
        let term = [];
        {(student.enrolled_sections).map((section) => {
            term.push({ term: section.section.section_term})
        })}
        term.sort((a,b) => b.term.localeCompare(a.term))
        let recentTerm = term[0]
        setTermValue(formatTerm(recentTerm.term))
        let payload = student.enrolled_sections.filter(
            (payload) => payload.section.section_term == recentTerm.term
        );
        setFilteredClasses(payload)      
      }, []);

    if (student.enrolled_sections) {
        let result = [];
        result.push(
            <TableContainer component={Paper} height="100vh" sx={{width:"100%"}}>
                <Typography sx={{ fontSize: 36, mb: 1 }} align="center">
                    {termValue} {/* will be dynamic, just placeholder for styling */}
                </Typography>
                <Table sx={{ Width: 250 }} aria-label="enrolled courses" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Name</TableCell>
                            <TableCell align='right'>Course Code</TableCell>
                            <TableCell align='right'>Credit Hours</TableCell>
                            <TableCell align='right'>Department Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filteredClasses).map((courseData) => (

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