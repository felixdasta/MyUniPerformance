import React, { useCallback, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InfiniteScroll from 'react-infinite-scroller';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { FormControl, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputLabel, List, MenuItem, Select, TextField } from "@mui/material";
import { get_sections_grades_stats } from "../../actions/sections";
import { get_courses_by_id, get_courses_by_university } from "../../actions/courses";

export default function CurriculumCoursePicker(props) {
    const [filters, setFilters] = useState();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ department_id: "", course_id: "", year: "", semester: "", section_id: "", grade: "" });
    const [course, setCourse] = useState();
    const [sections, setSections] = useState();
    const [filteredSections, setFilteredSections] = useState();
    const [missingCourses, setMissingCourses] = useState([]);

    const [selectDepartment, setSelectDepartment] = useState();
    const [selectCourses, setSelectCourses] = useState();
    const [selectYears, setSelectYears] = useState();
    const [selectSemesters, setSelectSemesters] = useState();
    const selectGrades = ["IP", "A", "B", "C", "D", "F", "P", "W", "IB", "ID", "IC", "IF"]

    const university = 1;

    const handleClickOpen = useCallback((course) => {
        setOpen(true);
        setCourse(course);

        // check if non free elective
        // initial value electives is the department id
        // free electives have no initial value
        if (course.course.course_code.slice(4, 8) === "XXXX" ||
            (course.course.course_code.slice(0, 4) === "----" && course.course.department.department_name !== "Other")) {
            setFormData({ ...formData, department_id: course.course.department.department_id })
            setSelectDepartment(course.course.department.department_id)
            get_courses_by_university(university, { department_id: course.course.department.department_id }).then(response => {
                setSelectCourses(response.data.courses)
            })
        }
        else {
            let yearsSet = new Set();
            get_courses_by_id(course.course.course_id).then(response => {
                setSections(response.data.sections);
                response.data.sections.forEach(record => {
                    yearsSet.add(record.section_term.slice(0, 4))
                })
                setSelectYears(Array.from(yearsSet))
            })
        }

    }, []);

    const handleClose = () => {
        setOpen(false);
        setSelectYears();
        setSelectSemesters();
        setFormData({ year: "", semester: "", section_id: "", grade: "" });
    };
    const handleSubmit = () => {
        setOpen(false);
    };

    const handleFormData = (e) => {
        switch (e.target.name) {
            case "year":
                setFormData({ ...formData, year: e.target.value })
                filterSectionList({ ...formData, year: e.target.value })
                break;
            case "semester":
                setFormData({ ...formData, semester: e.target.value })
                break;
            case "section_id":
                setFormData({ ...formData, section_id: e.target.value })
                break;
            case "grade":
                setFormData({ ...formData, grade: e.target.value })
                break;
            default:
                break;
        }
    }

    const filterSectionList = (filters) => {
        let newFilteredSections = []
        let newSelectSemesters = new Set();

        sections.forEach(record => {
            if (filters.year !== "" && record.section_term.slice(0, 4) === filters.year) {
                newFilteredSections.push(record)
                newSelectSemesters.add(record.section_term.slice(4, 6))
            }
        });
        setSelectSemesters(Array.from(newSelectSemesters))
        setFilteredSections(newFilteredSections)
    }

    useEffect(() => {
        let curriculumCourses = props.student.curriculums[0].courses
        let coursesTaken = []
        let coursesMissing = []

        // filter for missing courses
        props.student.enrolled_sections.forEach(record => {
            coursesTaken.push(record.section.course.course_code)
        });

        // extract missing courses
        curriculumCourses.forEach(record => {
            if (!coursesTaken.includes(record.course.course_code)) {
                coursesMissing.push(record)
            }
        });
        setMissingCourses(coursesMissing)
    }, [open])

    return (
        <Box boxShadow={1} height={716} sx={{ border: '1px' }}>
            <List sx={{ width: '100%', height: 700, maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto' }}>
                {<InfiniteScroll>
                    {missingCourses.map((course) => (
                        <div>
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="submit" onClick={() => {
                                        handleClickOpen(course)
                                    }}>
                                        <DoubleArrowIcon />
                                    </IconButton>
                                }
                                key={course.course.course_id}
                            >
                                <ListItemText
                                    primary={course.course.course_code}
                                    secondary={course.course.course_name}
                                />
                            </ListItem>
                            <Divider variant="middle" />
                        </div>))}
                </InfiniteScroll>}
            </List>

            <Dialog open={open} onClose={handleClose} maxWidth={"Lg"}>
                <DialogTitle>Add {course ? ((course.course.course_code.slice(4, 8) !== "XXXX") ? course.course.course_code : course.course.course_name) : "None"} to Curriculum</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please choose the year, semester, and section code of the course taken, as well as the grade obtained for this course
                    </DialogContentText>

                    {/* Department input */}
                    {selectYears ?
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="department-label">Department</InputLabel>
                            <Select
                                value={formData.department}
                                onChange={handleFormData}
                                label="department"
                                name="department"
                            >{(selectYears).map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>
                            ))}
                            </Select>
                        </FormControl> :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="department-label">Department</InputLabel>
                        </FormControl>
                    }

                    {/* Course input */}
                    {selectYears ?
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="year-label">Year</InputLabel>
                            <Select
                                value={formData.year}
                                onChange={handleFormData}
                                label="year"
                                name="year"
                            >{(selectYears).map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>
                            ))}
                            </Select>
                        </FormControl> :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="year-label">Year</InputLabel>
                        </FormControl>
                    }

                    {/* Year input */}
                    {selectYears ?
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="year-label">Year</InputLabel>
                            <Select
                                value={formData.year}
                                onChange={handleFormData}
                                label="year"
                                name="year"
                            >{(selectYears).map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>
                            ))}
                            </Select>
                        </FormControl> :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="year-label">Year</InputLabel>
                        </FormControl>
                    }

                    {/* Semester input */}
                    {(formData.year) ?
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="semester-label">Semester</InputLabel>
                            <Select
                                value={formData.semester}
                                onChange={handleFormData}
                                label="semester"
                                name="semester"
                            >{(selectSemesters).map((record) => (
                                <MenuItem value={record}>{record}</MenuItem>
                            ))}
                            </Select>
                        </FormControl> :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="year-label">Semester</InputLabel>
                        </FormControl>
                    }

                    {/* Section Code input */}
                    {(formData.year && formData.semester) ?
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="section_id-label">Section</InputLabel>
                            <Select
                                value={formData.section_id}
                                onChange={handleFormData}
                                label="section_id"
                                name="section_id"
                            >{(filteredSections).map((record) => (
                                <MenuItem value={record.section_id}>{record.section_code}</MenuItem>
                            ))}
                            </Select>
                        </FormControl> :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="year-label">Section</InputLabel>
                        </FormControl>
                    }

                    {/* Grade input */}
                    <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                        <InputLabel id="grade-label">Grade</InputLabel>
                        <Select
                            value={formData.grade}
                            onChange={handleFormData}
                            label="grade"
                            name="grade"
                        >{selectGrades.map((grade) => (
                            (grade == "IP") ? <MenuItem value={grade}>In Progress</MenuItem> : <MenuItem value={grade}>{grade}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color={"error"}>Cancel</Button>
                    <Button onClick={handleSubmit} variant={"contained"}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Box >

    );
}
