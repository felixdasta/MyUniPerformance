import { React, useCallback, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  TextField,
  MenuItem,
} from "@mui/material";
import { Paper, Table, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import CoursesCategories from "../../components/CoursesCategories/CoursesCategories";
import {
  get_available_semesters_by_academic_year,
  semesters,
} from "../../actions/sections";
import axios from "axios";
import { ResponsiveContainer } from "recharts";
import { Box, shadows } from "@mui/system";

const useStyles = makeStyles({
  tableContainer: {
    overflowY: "auto",
  },
  table: {
    maxHeight: "50%",
    overflowY: "scroll",
  },
});

function CurriculumTable(props) {
  let [filters, setFilters] = useState({
    section_term: "",
  });
  let terms_taken = [];
  let student = props.student;
  let term_dropdown_style = {
    backgroundColor: "white",
    height: 35,
    width: 140,
    fontSize: 14,
    padding: 5,
  };

  const classes = useStyles();
  const [academicSemesters, setAvailableAcademicSemesters] = useState([]);
  const [academicYear, setAcademicYear] = useState("All");
  const [semester, setSemester] = useState("All");
  const [filteredClasses, setFilteredClasses] = useState([]);

  //Defining styles for table
  useEffect(() => {
    let academic_semesters =
      get_available_semesters_by_academic_year(terms_taken);
    setAvailableAcademicSemesters(academic_semesters);
    setFilteredClasses(student.enrolled_sections);
  }, []);

  if (student.enrolled_sections) {
    student.enrolled_sections.map((termData) => {
      if (!(termData.section.section_term in terms_taken)) {
        terms_taken.push(termData.section.section_term);
      }
    });
  }

  function updateTable() {
    if (student.enrolled_sections) {
      if (filters.section_term !== "") {
        setFilteredClasses(student.enrolled_sections);
        let payload = student.enrolled_sections.filter(
          (payload) => payload.section.section_term === filters.section_term
        );
        setFilteredClasses(payload);
      } else if (filters.section_term === "") {
        setFilteredClasses(student.enrolled_sections);
      }
    }
  }

  if (student.enrolled_sections) {
    let result = [];
    result.push(
      <Grid
        item
      >
        <TableContainer
          component={Paper}
          className={classes.tableContainer}
          style={{
            maxHeight: 500,
            maxWidth: "100%"
          }}
        >
          <Typography sx={{ fontSize: 36, mb: 1 }} align="center">
            {"My Curriculum"}{" "}
            {/* will be dynamic, just placeholder for styling */}
          </Typography>
          <Table
            sx={{ minWidth: 600 }}
            aria-label="enrolled courses"
            className={classes.table}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell align="right">Course Code</TableCell>
                <TableCell align="right">Credit Hours</TableCell>
                <TableCell align="right">Department Name</TableCell>
                <TableCell align="right">Grade Obtained</TableCell>
                <TableCell align="right">Term Taken</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClasses.map((courseData) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={courseData.section.course.course_name}
                  hover={true}
                >
                  <TableCell component="th" scope="row">
                    {courseData.section.course.course_name}
                  </TableCell>
                  <TableCell align="right">
                    {courseData.section.course.course_code}
                  </TableCell>
                  <TableCell align="right">
                    {courseData.section.course.course_credits}
                  </TableCell>
                  <TableCell align="right">
                    {courseData.section.course.department.department_name}
                  </TableCell>
                  <TableCell align="right">
                    {courseData.grade_obtained}
                  </TableCell>
                  <TableCell align="right">
                    {courseData.section.section_term}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Container
        sx={{my:1}}>
          <FormControl sx={{mx:-15}}>
            <Select
              style={term_dropdown_style}
              value={academicYear}
              displayEmpty
              name="year"
              onChange={(e) => {
                setAcademicYear(e.target.value);
                //assume that the selected year doesn't contains the selected academic semester
                let contains_semester = false;
                {
                  academicSemesters[e.target.value] &&
                    academicSemesters[e.target.value].map(
                      (entry) =>
                        (contains_semester =
                          entry.key == semester ? true : contains_semester)
                    );
                }
                setSemester(contains_semester ? semester : "All");
              }}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="All">
                <em>All</em>
              </MenuItem>{" "}
              {Object.keys(academicSemesters).map((year) => (
                <MenuItem value={year}>{year}</MenuItem>
              ))}
            </Select>
            <label>Year Taken</label>
          </FormControl>
          <FormControl sx={{mx: 17}}>
            <Select
              style={term_dropdown_style}
              value={semester}
              displayEmpty
              name="semester"
              onChange={(e) => {
                setSemester(e.target.value);
              }}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="All">
                <em>All</em>
              </MenuItem>
              {academicYear != "All"
                ? academicSemesters[academicYear].map((entry) => (
                    <MenuItem value={entry.key}>{entry.value}</MenuItem>
                  ))
                : Object.keys(semesters).map((key) => (
                    <MenuItem value={key}>{semesters[key]}</MenuItem>
                  ))}
            </Select>
            <label>Semester</label>
          </FormControl>
          <Button sx={{mx: -15}}
            onClick={() => {
              let year = academicYear.substring(0, 4);
              let section_term =
                (year == "All" ? "" : year) +
                (semester == "All" ? "" : semester);
              filters.section_term = section_term;
              filters.page = 1;
              updateTable();
            }}
            align="center"
            variant="contained"
            
          >
            Apply Filters
          </Button>
        </Container>
      </Grid>
    );
    return result;
  }
}
export default CurriculumTable;