import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Paper, Table } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroller';
import * as Loader from "react-loader-spinner";
import './FilteredInstructorsList.scss'

function FilteredInstructorsList(props) {
  let [instructors, setInstructors] = useState();
  const [fetchedInstructors, setFetchedInstructors] = useState();
  let [filters, setFilters] = useState();
  const [lastPage, setLastPage] = useState();

  let navigate = useNavigate();

  const fetchData = () => {
    filters.page = filters.page + 1;
    props.setInstructors(setFetchedInstructors, filters)
  }

  const viewInstructorDetails = (index) => {
    //navigate('details', {state: {instructor: instructors[index], filters: filters}});
  }

  useEffect(() => {
    setLastPage(props.lastPage);
    setFilters(props.filteredData);
    setInstructors(props.instructors);
  }, []);

  useEffect(() => {
    if (fetchedInstructors) {
      for (let course of fetchedInstructors) {
        instructors.push(course);
      }
      setFetchedInstructors(null);
    }
  }, [fetchedInstructors])

  //Defining styles for table
  if (instructors) {
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
              <TableCell>Instructor Name</TableCell>
              <TableCell align='right'>Department Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(instructors).map((instructor, index) => (<TableRow class="historical-courses" 
                                                         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                         key={instructor.member_id}
                                                         onClick={ () => {viewInstructorDetails(index)}}>
              <TableCell component="th" scope='row'> {instructor.name} </TableCell>
              <TableCell align='right'>{instructor.department.department_name}</TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </InfiniteScroll>
    </TableContainer>)
  }
  else {
    return null;
  }

} export default (FilteredInstructorsList);