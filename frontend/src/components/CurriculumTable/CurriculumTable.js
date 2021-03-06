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
  MenuItem,
  IconButton,
  DialogActions,
  DialogContent,
  Dialog,
  DialogContentText,
  CardContent,
} from "@mui/material";
import { Paper, Table, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from "@material-ui/styles";
import {
  drop_student_from_course,
  get_available_semesters_by_academic_year,
  semesters,
} from "../../actions/sections";
import {
  get_sections_grades_stats,
  calculate_gpa_based_on_counts
} from '../../actions/sections';
import { formatTerm } from "../../actions/sections";

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

  const calculate_gpa_based_on_sections_taken = (payload) => {
    let gpaCredits = 0;
    let honorPoints = 0;
    payload.map((courseData) => {
      switch (courseData.grade_obtained) {
        case "A":
          honorPoints = honorPoints + 4 * courseData.section.course.course_credits;
          gpaCredits += courseData.section.course.course_credits;
          break;
        case "B":
          honorPoints = honorPoints + 3 * courseData.section.course.course_credits;
          gpaCredits += courseData.section.course.course_credits;
          break;
        case "C":
          honorPoints = honorPoints + 2 * courseData.section.course.course_credits;
          gpaCredits += courseData.section.course.course_credits;
          break;
        case "D":
          honorPoints = honorPoints + 1 * courseData.section.course.course_credits;
          gpaCredits += courseData.section.course.course_credits;
          break;
        case "F":
          honorPoints = honorPoints + 0 * courseData.section.course.course_credits;
          gpaCredits += courseData.section.course.course_credits;
          break;
        default:
          break;
      }
    });
    let gpa = honorPoints / gpaCredits;
    return gpa.toFixed(2);
  }

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
  const [studentGPA, setStudentGPA] = useState();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState();
  const [deleteCourseSection, setDeleteCourseSection] = useState();

  //Defining styles for table
  useEffect(() => {
    let academic_semesters = get_available_semesters_by_academic_year(terms_taken);
    setAvailableAcademicSemesters(academic_semesters);
    let enrolled_sections = student.enrolled_sections;
    setFilteredClasses(enrolled_sections.sort(
      function (a, b) {
        if (a.section.section_term === b.section.section_term) {
          // Grade is only important when sections are the same
          return a.grade_obtained - b.grade_obtained;
        }
        return a.section.section_term > b.section.section_term ? 1 : -1;
      }));

    setStudentGPA(calculate_gpa_based_on_sections_taken(enrolled_sections));
    setFilteredClasses(enrolled_sections);
    updateTable();
  }, [props.student]);

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
        let payload = student.enrolled_sections.filter(
          (payload) => payload.section.section_term.includes(filters.section_term)
        );

        setStudentGPA(calculate_gpa_based_on_sections_taken(payload));
        setFilteredClasses(payload);
      }
      else {
        setStudentGPA(calculate_gpa_based_on_sections_taken(student.enrolled_sections));
        setFilteredClasses(student.enrolled_sections);
      }
    }
  }

  const sectionClickHandler = useCallback((section) => {
    return async (e) => {
      e.preventDefault()
      props.changeSection(section)
    }
  }, [])

  const modificationClickHandler = useCallback((action, course) => {
    return async (e) => {
      e.preventDefault()
      if (action === "edit") {
        props.refreshTable();
      }
      else {
        setDeleteConfirmationOpen(true)
        setDeleteCourseSection(course)
      }
    }
  }, [])

  const handleSubmit = () => {
    drop_student_from_course(student.user_id, deleteCourseSection.section.section_id, deleteCourseSection.grade_obtained).then(response => {
      props.refreshTable(response.data.message);
      setDeleteCourseSection();
      setDeleteConfirmationOpen(false);
    }).catch((error) => {
      console.log(error)
    })
  }

  const handleClose = () => {
    setDeleteCourseSection();
    setDeleteConfirmationOpen(false);
  }

  if (student.enrolled_sections) {
    let sectionGPA = [];
    let sections_gpa_sum = 0;
    filteredClasses.map((payload, i) => {
      let grades_count = get_sections_grades_stats([payload.section]);
      let curr_section_gpa = calculate_gpa_based_on_counts(grades_count);
      sections_gpa_sum += parseFloat(curr_section_gpa);
      sectionGPA.push(curr_section_gpa);
    });
    let avg_sections_gpa = (sections_gpa_sum / sectionGPA.length).toFixed(2);
    return (
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
                <TableCell></TableCell>
                <TableCell align="left"> Course Name</TableCell>
                <TableCell align="center">Course Code</TableCell>
                <TableCell align="center">Credit Hours</TableCell>
                <TableCell align="left">Department Name</TableCell>
                <TableCell align="center">Grade Obtained</TableCell>
                <TableCell align="left">Term Taken</TableCell>
                <TableCell align="right">Section GPA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClasses.map((courseData, i) => (
                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={courseData.section.course.course_name}
                  onClick={sectionClickHandler(courseData)}
                  hover={true}>
                  <TableCell align="left">
                    <IconButton aria-label="delete" color="error" onClick={modificationClickHandler("delete", courseData)}>
                      <DeleteIcon />
                    </IconButton>
                    {/*                     <IconButton aria-label="edit" color="primary" onClick={modificationClickHandler("edit", courseData)}>
                      <EditIcon />
                    </IconButton> */}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {courseData.section.course.course_name}
                  </TableCell>
                  <TableCell align="center">
                    {courseData.section.course.course_code}
                  </TableCell>
                  <TableCell align="center">
                    {courseData.section.course.course_credits}
                  </TableCell>
                  <TableCell align="left">
                    {courseData.section.course.department.department_name}
                  </TableCell>
                  <TableCell align="center">
                    {courseData.grade_obtained}
                  </TableCell>
                  <TableCell align="left">
                    {formatTerm(courseData.section.section_term)}
                  </TableCell>
                  <TableCell align="right">
                    {sectionGPA[i]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container md={12}>
          <Grid container item md={8}>
            <Container
              sx={{ my: 1 }}>
              <FormControl sx={{ mx: -3 }}>
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
                <label>Academic Year</label>
              </FormControl>
              <FormControl sx={{ mx: 6 }}>
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
              <Button sx={{ mx: 3 }}
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
          <Grid container justifyContent="flex-end" item md={4} style={{ marginTop: 5 }}>
            <CardContent>
              <div>
                <Typography align={"right"}>{(filters.section_term.length == 6 ? "Semester GPA: " :
                  filters.section_term.length == 4 ? "Academic Year GPA: " :
                    "GPA: ") + (studentGPA ? studentGPA : "N/A")}
                </Typography>
              </div>

              <Typography align={"right"}>{"Average Sections GPA: " + avg_sections_gpa}
              </Typography>
            </CardContent>


          </Grid>

        </Grid>
        {deleteCourseSection && <Dialog open={deleteConfirmationOpen} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>
              {"Are you sure you want to delete " + deleteCourseSection.section.course.course_code + " ?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button edge="start" onClick={handleClose} color="error">Cancel</Button>
            <Button edge="end" onClick={handleSubmit} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>}
      </Grid>

    );
  }
}
export default CurriculumTable;