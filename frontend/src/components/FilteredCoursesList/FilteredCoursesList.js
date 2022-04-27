import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Table } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroller';
import * as Loader from "react-loader-spinner";
import './FilteredCoursesList.scss'

function FilteredCoursesList(props) {
  let [courses, setCourses] = useState();
  const [fetchedCourses, setFetchedCourses] = useState();
  let [filters, setFilters] = useState();
  const [lastPage, setLastPage] = useState();

  let navigate = useNavigate();

  const fetchData = () => {
    filters.page = filters.page + 1;
    props.setCourses(setFetchedCourses, filters)
  }

  const viewCourseDetails = (index) => {
    navigate('details', {state: {course: courses[index], filters: filters}});
  }

  useEffect(() => {
    setLastPage(props.lastPage);
    setFilters(props.filteredData);
    setCourses(props.courses);
  }, []);

  useEffect(() => {
    if (fetchedCourses) {
      for (let course of fetchedCourses) {
        courses.push(course);
      }
      setFetchedCourses(null);
    }
  }, [fetchedCourses])

  //Defining styles for table
  if (courses) {
    return (
    <TableContainer style={{overflowY: "hidden"}} component={Paper}>
      <InfiniteScroll
        pageStart={1}
        loadMore={fetchData}
        hasMore={filters.page < lastPage}
        loader={
          <div className='infinite-loader'>
          <Loader.RotatingLines style={{display: "inline-block"}} color="black" height={40} width={40} />
          </div>

        }
      >
        <Table sx={{ minWidth: 350 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell align='right'>Course Code</TableCell>
              <TableCell align='right'>Credit Hours</TableCell>
              <TableCell align='right'>Department Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(courses).map((course, index) => (<TableRow class="historical-courses" 
                                                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                         key={course.course_id}
                                                         onClick={ () => {viewCourseDetails(index)}}>
              <TableCell component="th" scope='row'> {course.course_name} </TableCell>
              <TableCell align='right'>{course.course_code}</TableCell>
              <TableCell align='right'>{course.course_credits}</TableCell>
              <TableCell align='right'>{course.department.department_name}</TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </InfiniteScroll>
    </TableContainer>)
  }
  else {
    return null;
  }

} export default (FilteredCoursesList);