import * as React from 'react';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Table } from '@mui/material';

function UniversityCourses(props) {
    let courses = props.courses;

    //Defining styles for table
    if(courses) {
        return ( <TableContainer component={Paper}>
            <Table sx={{ minWidth: 350}} aria-label="simple table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell align='right'>Course Code</TableCell>
                  <TableCell align='right'>Credit Hours</TableCell>
                  <TableCell align='right'>Department Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody> {(courses).map((course) => ( <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={course.course_id}>
                  <TableCell component="th" scope='row'> {course.course_name} </TableCell>
                  <TableCell align='right'>{course.course_code}</TableCell>
                  <TableCell align='right'>{course.course_credits}</TableCell>
                  <TableCell align='right'>{course.department.department_name}</TableCell>
                </TableRow> ))} </TableBody>
            </Table>
          </TableContainer>)
    }

} export default (UniversityCourses);