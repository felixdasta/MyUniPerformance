import React, { useCallback, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InfiniteScroll from 'react-infinite-scroller';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { FormControl, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputLabel, List, MenuItem, Select, TextField, Typography } from "@mui/material";
import { enroll_student_or_update_grade } from "../../actions/sections";
import { get_courses_by_department_id, get_courses_by_id } from "../../actions/courses";
import { get_departments_by_university } from "../../actions/departments";
import { get_specified_academic_year, semesters } from "../../actions/sections";

export default function CurriculumCoursePicker(props) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ department_id: "", course_id: "", year: "", semester: "", section_id: "", grade: "" });
    const [course, setCourse] = useState();
    const [sections, setSections] = useState();
    const [missingCourses, setMissingCourses] = useState([]);

    const [selectDepartments, setSelectDepartments] = useState();
    const [selectCourses, setSelectCourses] = useState();
    const [selectYears, setSelectYears] = useState();
    const [selectSemesters, setSelectSemesters] = useState();
    const [selectSections, setSelectSections] = useState();
    const selectGrades = ["IP", "A", "B", "C", "D", "F", "P", "W", "IB", "ID", "IC", "IF"]

    const socioHumanisticFilter = [29, 24, 25, 26, 12, 27, 33]
    const university = 1;

    const handleClickOpen = useCallback((course) => {
        setOpen(true);
        setCourse(course);

        // check if non free elective
        // initial value electives is the department id
        if (course.course.course_code.slice(4, 8) === "XXXX") {
            setFormData({ ...formData, department_id: course.course.department.department_id });
            setSelectDepartments([course.course.department]);
            getCoursesByDepartmentID(course.course.department.department_id);
        }

        // check if free elective
        // free electives have no initial value
        else if (course.course.department.department_name === "Other") {
            get_departments_by_university(university).then(response => {
                setSelectDepartments(response.data);
            })
        }

        else if (course.course.course_code === "----") {
            let socioHumanisticDepartments = []

            get_departments_by_university(university).then(response => {
                response.data.forEach(record => {
                    if (socioHumanisticFilter.includes(record.department_id)) {
                        socioHumanisticDepartments.push(record)
                    }
                });
                setSelectDepartments(socioHumanisticDepartments);
            })
        }

        // regular course
        // initial value is the department and course id
        else {
            setFormData({ ...formData, department_id: course.course.department.department_id, course_id: course.course.course_id })
            setSelectDepartments([course.course.department]);
            setSelectCourses([course.course]);
            getSectionsByCourseID(course.course.course_id);
        }

    }, []);

    const handleClose = () => {
        setOpen(false);
        setSelectDepartments();
        setSelectCourses();
        setSelectYears();
        setSelectSemesters();
        setSelectSections();
        setFormData({ department_id: "", course_id: "", year: "", semester: "", section_id: "", grade: "" });
    };

    const handleSubmit = () => {
        setOpen(false);
        setSelectDepartments();
        setSelectCourses();
        setSelectYears();
        setSelectSemesters();
        setSelectSections();
        enroll_student_or_update_grade(props.student.user_id, formData.section_id, formData.grade).then(response => {
            //maybe some success alert
            props.refreshTable(response.data.message);
        }).catch((error) => {
            //maybe some failure alert
        })
    };

    const handleFormData = (e) => {
        switch (e.target.name) {
            case "department_id":
                setFormData({ ...formData, department_id: e.target.value, course_id: "", year: "", semester: "", section_id: "" });
                getCoursesByDepartmentID(e.target.value);
                break;
            case "course_id":
                setFormData({ ...formData, course_id: e.target.value, year: "", semester: "", section_id: "" });
                getSectionsByCourseID(e.target.value);
                break;
            case "year":
                setFormData({ ...formData, year: e.target.value, semester: "", section_id: "" });
                filterSectionsByYear(e.target.value);
                break;
            case "semester":
                setFormData({ ...formData, semester: e.target.value, section_id: "" });
                filterSectionsBySemester(formData.year, e.target.value);
                break;
            case "section_id":
                setFormData({ ...formData, section_id: e.target.value });
                break;
            case "grade":
                setFormData({ ...formData, grade: e.target.value });
                break;
            default:
                break;
        }
    }

    const getCoursesByDepartmentID = (department_id) => {
        get_courses_by_department_id(department_id).then(response => {
            setSelectCourses(response.data.courses)
        })
    }

    const getSectionsByCourseID = (course) => {
        let yearsSet = new Set();

        get_courses_by_id(course).then(response => {
            setSections(response.data.sections);
            response.data.sections.forEach(record => {
                yearsSet.add(record.section_term.slice(0, 4))
            })
            setSelectYears(Array.from(yearsSet).sort())
        })
    }

    const filterSectionsByYear = (year) => {
        let newSelectSemesters = new Set();

        sections.forEach(record => {
            if (year !== "" && record.section_term.slice(0, 4) === year) {
                newSelectSemesters.add(record.section_term.slice(4, 6))
            }
        });
        setSelectSemesters(Array.from(newSelectSemesters).sort())
    }

    const filterSectionsBySemester = (year, semester) => {
        let newSelectSections = []

        sections.forEach(record => {
            if ((year !== "" && semester !== "") && (record.section_term.slice(0, 4) === year) && (record.section_term.slice(4, 6) === semester)) {
                newSelectSections.push(record)
            }
        });
        setSelectSections(newSelectSections);
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
    }, [open, props.student])

    return (
        <Box boxShadow={1} height={716} sx={{ border: '1px' }}>
            <Typography sx={{ fontSize: 36, mb: 1 }} align="center">
                {"Courses Missing"}{" "}
                {/* will be dynamic, just placeholder for styling */}
            </Typography>
            <List sx={{ width: '100%', height: 628, maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto' }}>
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

            {course && <Dialog open={open} onClose={handleClose} maxWidth={"Lg"}>
                <DialogTitle>Add {course && (course.course.course_code === "----" || course.course.course_code.slice(4, 8) === "XXXX") ? course.course.course_name : course.course.course_code} to Curriculum</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please choose the year, semester, and section code of the course taken, as well as the grade obtained for this course
                    </DialogContentText>

                    {/* Department input */}
                    {selectDepartments ?
                        ((course.course.course_code !== "----") ?
                            <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                                <InputLabel id="department-label">{selectDepartments[0].department_name}</InputLabel>
                            </FormControl> :
                            <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                                <InputLabel id="department-label">Department</InputLabel>
                                <Select
                                    value={formData.department}
                                    onChange={handleFormData}
                                    label="department"
                                    name="department_id"
                                >
                                    {(selectDepartments).map((record) => (
                                        <MenuItem value={record.department_id}>{record.department_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>) :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="department-label">Department</InputLabel>
                        </FormControl>
                    }

                    {/* Course input */}
                    {selectCourses ?
                        ((course.course.course_code !== "----" && course.course.course_code.slice(4, 8) !== "XXXX") ?
                            <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                                <InputLabel id="department-label">{selectCourses[0].course_code}</InputLabel>
                            </FormControl> :
                            <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                                <InputLabel id="course-label">Course</InputLabel>
                                <Select
                                    value={formData.course_id}
                                    onChange={handleFormData}
                                    label="course"
                                    name="course_id"
                                >{(selectCourses).map((record) => (
                                    <MenuItem value={record.course_id}>{record.course_code}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>) :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="course-label">Course</InputLabel>
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
                                <MenuItem value={year}>{get_specified_academic_year(year)}</MenuItem>
                            ))}
                            </Select>
                        </FormControl> :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="year-label">Year</InputLabel>
                        </FormControl>
                    }

                    {/* Semester input */}
                    {selectSemesters ?
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="semester-label">Semester</InputLabel>
                            <Select
                                value={formData.semester}
                                onChange={handleFormData}
                                label="semester"
                                name="semester"
                            >{(selectSemesters).map((record) => (
                                <MenuItem value={record}>{semesters[record]}</MenuItem>
                            ))}
                            </Select>
                        </FormControl> :
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }} disabled>
                            <InputLabel id="year-label">Semester</InputLabel>
                        </FormControl>
                    }

                    {/* Section Code input */}
                    {selectSections ?
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="section_id-label">Section</InputLabel>
                            <Select
                                value={formData.section_id}
                                onChange={handleFormData}
                                label="section_id"
                                name="section_id"
                            >{(selectSections).map((record) => (
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
            </Dialog>}
        </Box >

    );
}
