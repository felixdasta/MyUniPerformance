import React, { useCallback, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InfiniteScroll from 'react-infinite-scroller';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { FormControl, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, InputLabel, List, MenuItem, Select, TextField } from "@mui/material";
import { get_sections_grades_stats } from "../../actions/sections";

export default function CurriculumCoursePicker(props) {
    const [filters, setFilters] = useState();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ year: "", semester: "", section_code: "", grade: "" });
    const [course, setCourse] = useState();
    const [missingCourses, setMissingCourses] = useState([]);

    const grade_list = ["IP", "A", "B", "C", "D", "F", "P", "W", "IB", "ID", "IC", "IF"]

    const handleClickOpen = useCallback((course) => {
        setOpen(true);
        setCourse(course);
    }, []);
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        setOpen(false);
    };

    const handleFormData = (e) => {
        console.log(course)
        switch (e.target.name) {
            case "year":
                setFormData({ ...formData, year: e.target.value })
                break;
            case "semester":
                setFormData({ ...formData, semester: e.target.value })
                break;
            case "section_code":
                setFormData({ ...formData, section_code: e.target.value })
                break;
            case "grade":
                setFormData({ ...formData, grade: e.target.value })
                break;
            default:
                break;
        }
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

    if (missingCourses) {
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
                <Dialog open={open} onClose={handleClose} maxWidth={"md"}>
                    <DialogTitle>Add {course ? course.course.course_code : "None"} to Curriculum</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please choose a valid year and/or section code as well as the grade obtained for this course
                        </DialogContentText>

                        {/* Year input */}
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="year-label">Year</InputLabel>
                            <Select
                                value={formData.year}
                                onChange={handleFormData}
                                label="year"
                                name="year"
                            >
                                <MenuItem value="">
                                    <em>-</em>
                                </MenuItem>
                                <MenuItem value={1990}>1990</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Semester input */}
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="semester-label">Semester</InputLabel>
                            <Select
                                value={formData.semester}
                                onChange={handleFormData}
                                label="semester"
                                name="semester"
                            >
                                <MenuItem value="">
                                    <em>-</em>
                                </MenuItem>
                                <MenuItem value={1990}>1990</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Section Code input */}
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="section_code-label">Section Code</InputLabel>
                            <Select
                                value={formData.section_code}
                                onChange={handleFormData}
                                label="section_code"
                                name="section_code"
                            >
                                <MenuItem value="">
                                    <em>-</em>
                                </MenuItem>
                                <MenuItem value="MATE3032">MATE3032</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Grade input */}
                        <FormControl variant="standard" sx={{ m: 1.5, minWidth: 120 }}>
                            <InputLabel id="grade-label">Grade</InputLabel>
                            <Select
                                value={formData.grade}
                                onChange={handleFormData}
                                label="grade"
                                name="grade"
                            >{grade_list.map((grade) => (
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
}