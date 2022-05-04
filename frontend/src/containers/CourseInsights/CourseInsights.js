import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as Loader from "react-loader-spinner";
import './CourseInsights.scss';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, Text,
    PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { get_courses_by_id } from '../../actions/courses';
import {
    get_available_sections_filters,
    get_filtered_sections,
    get_students_count_by_term,
    get_specified_semester,
    get_specified_year,
    get_specified_academic_year,
    year_contains_academic_semester,
    evaluate_and_apply,
    get_students_count_by_instructor,
    get_sections_grades_stats,
    calculate_gpa_based_on_counts
} from '../../actions/sections';
import {
    Box, MenuItem, FormControl,
    Select, TextField, Button,
    Typography, Avatar, Snackbar,
    Alert, Paper, Grid, CardContent, Card
} from '@mui/material';
import { randomColor, GRADE_COLORS } from '../../actions/utilities';
import CourseFeedback from '../../components/CourseFeedback/CourseFeedback';


const renderCustomizedLabel = ({ percent }) => {
    return (`${(percent * 100).toFixed(0)}%`);
};

let avatar_style = {
    bgcolor: randomColor(),
    height: 150,
    width: 150,
    fontSize: 60,
};

export default function CourseInsights() {
    const CustomizedAxisTick = (props) => {
        const { x, y, payload } = props;

        return <Text
            fontSize={12}
            x={x}
            y={y}
            width={20}
            textAnchor="middle"
            verticalAnchor="start">{payload.value}
        </Text>
    }
    const location = useLocation();
    const [course, setCourse] = useState();
    const [sections, setSections] = useState();
    const [studentsCountByTerm, setStudentsCountByTerm] = useState();
    const [studentsCountByInstructor, setStudentsCountByInstructor] = useState();
    const [gradesCount, setGradesCount] = useState();
    const [GPA, setGPA] = useState();
    let [filters, setFilters] = useState();

    //criterias that will be used to filter sections
    const [selectedInstructor, setSelectedInstructor] = useState("All");
    const [academicYear, setAcademicYear] = useState("All");
    const [semester, setSemester] = useState("All");
    const [selectedSection, setSelectedSection] = useState("All");
    const [sectionsByInstructor, setSectionsByInstructor] = useState({});

    //for course feedback
    const [filteredSections, setFilteredSections] = useState();

    //a warning that will be displayed when changing instructor
    const [instructorDisplayWarning, setInstructorDisplayWarning] = useState();
    const [sectionDisplayWarning, setSectionDisplayWarning] = useState();

    const displayInstructorResetWarning = () => {
        let shouldDisplay =
            (academicYear != "All"
                || semester != "All"
                || selectedSection != "All");
        setInstructorDisplayWarning(shouldDisplay);
    }

    const filterSections = () => {
        let filtered_sections = get_filtered_sections(sections, filters);
        let students_count_by_term = get_students_count_by_term(filtered_sections);
        let students_count_by_instructor = get_students_count_by_instructor(filtered_sections);
        let grades_count = get_sections_grades_stats(filtered_sections);

        setGPA(calculate_gpa_based_on_counts(grades_count));
        setStudentsCountByTerm(students_count_by_term);
        setStudentsCountByInstructor(students_count_by_instructor);
        setGradesCount(grades_count);
        setFilteredSections(filtered_sections);

        if (filtered_sections.length == 1) {
            setSelectedSection(filtered_sections[0]);
        }

        if (filters.instructor_name) {
            setSelectedInstructor(() => {
                for (let section of filtered_sections) {
                    for (let instructor of section.instructors) {
                        if (instructor.name.toUpperCase().indexOf(filters.instructor_name.toUpperCase()) != -1) {
                            if (selectedInstructor != "All" && selectedInstructor.name != instructor.name) {
                                avatar_style.bgcolor = randomColor();
                            }
                            return instructor;
                        }
                    }
                }
                return "All";
            });
        }
    }

    const getInstructorName = () => selectedInstructor != "All" ? selectedInstructor.name : selectedInstructor;

    useEffect(() => {
        let course = location.state.course;
        let filters = location.state.filters;

        //accomodate the sections that corresponds to the current course
        get_courses_by_id(course.course_id).then(response => {
            let selection_filters = get_available_sections_filters(response.data.sections);
            setSectionsByInstructor(selection_filters)
            setSections(response.data.sections);
            setFilters(filters);
            //example: if section_term == 2020S2 or section_term == 2020, 
            //then year = 2020 but academic year is 2020-2021
            let academic_year = get_specified_academic_year(get_specified_year(filters.section_term));
            setAcademicYear(academic_year);
            //example: if section_term == 2020S2 or section_term == S2, then semester = S2
            setSemester(get_specified_semester(filters.section_term));
            setCourse(course);
        }).catch((error) => console.log(error));
    }, []);

    //retrieve sections that match criteria
    useEffect(() => {
        if (sections) {
            filterSections();
        }

    }, [filters]);

    let form_sx = { m: 1, width: 295 }
    let term_dropdown_style = { backgroundColor: "white", height: 35, width: 140, fontSize: 14 }

    if (course && sections) {
        return (
            <Box>
                <div className='center-components' style={{ fontWeight: 'bold', margin: "30px 0px 15px 0px" }}>{course.course_code}: {course.course_name}</div>

                <Grid container rowGap={3}>
                    {/* Top Row Container, each item container can be adjusted for width by changing lg*/}
                    <Grid container alignItems="center" justifyContent="center">

                        {selectedInstructor && selectedInstructor != "All" &&
                            <Grid item container lg={3} justifyContent={"center"}>
                                <Grid item lg={12}>
                                    <CardContent>
                                        <Typography variant="h5" component="div" align="center">
                                            {selectedInstructor.name}
                                        </Typography>
                                        <Typography variant="body2" align="center">
                                            Department of {selectedInstructor.department.department_name}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Avatar className='instructor-avatar' sx={avatar_style}>{selectedInstructor.name[0]}</Avatar>
                                    </CardContent>
                                </Grid>
                            </Grid>}

                        {(studentsCountByTerm.length > 1 || studentsCountByInstructor.length > 1) &&
                            <Grid item container md={6}>
                                <ResponsiveContainer className="center-components" width="100%" height={400}>
                                    <AreaChart
                                        data={(academicYear != "All" && semester != "All") ? studentsCountByInstructor : studentsCountByTerm}
                                        margin={{
                                            top: 0,
                                            right: 50,
                                            left: 25,
                                            bottom: 25
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis interval={1} dataKey="name" axisLine={false} tick={CustomizedAxisTick} />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="Enrolled students" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Grid>}

                        {gradesCount.length > 0 &&
                            <Grid item container md={3} justifyContent={"center"}>
                                <Grid item lg={12}>
                                    <CardContent>
                                        <Typography variant="h5" component="div" align="center">
                                            Grade Statistics
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={275}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    data={gradesCount}
                                                    cx="50%"
                                                    cy="50%"
                                                    label={renderCustomizedLabel}
                                                    fill="#8884d8"
                                                    outerRadius={80}
                                                >
                                                    {gradesCount.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.name]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <Typography variant="subtitle1" sx={{fontWeight: 450}} component="div" align="center">
                                            GPA: {GPA}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{fontStyle: "italic"}} component="div" align="center">
                                            *Based on selected criterias
                                        </Typography>
                                    </CardContent>
                                </Grid>
                            </Grid>}
                    </Grid>

                    {/* Bottom Row Container */}
                    <Grid container alignItems="center" justifyContent="center">
                        {/* Feedback Component */}
                        <Grid item container lg={6}>
                            <Grid item container lg={12}>
                                <Grid item xs={3}>
                                    <FormControl sx={form_sx}>
                                        <label>Instructor name</label>
                                        <Select style={term_dropdown_style}
                                            value={getInstructorName()} displayEmpty
                                            name="instructor"
                                            onChange={(e) => {
                                                displayInstructorResetWarning();

                                                let instructor = e.target.value;
                                                setSelectedInstructor(instructor);
                                                setAcademicYear("All");
                                                setSemester("All");
                                                setSelectedSection("All");
                                                //delete all section terms and section codes
                                                delete filters["section_term"]
                                                delete filters["section_code"]
                                                evaluate_and_apply(filters, instructor != "All", "instructor_name", instructor);
                                                filterSections();
                                            }
                                            }
                                            inputProps={{ 'aria-label': 'Without label' }}>
                                            {(Object.keys(sectionsByInstructor)).map((instructor) => (
                                                <MenuItem value={instructor}>{instructor}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl sx={form_sx}>
                                        <label>Academic Year</label>
                                        <Select style={term_dropdown_style}
                                            value={academicYear} displayEmpty
                                            name="year"
                                            onChange={(e) => {
                                                let academic_year = e.target.value;
                                                setAcademicYear(academic_year);
                                                let contains_semester = year_contains_academic_semester(
                                                    academic_year,
                                                    semester,
                                                    sectionsByInstructor[getInstructorName()]);
                                                let section_term = (academic_year == "All" ? ""
                                                    : academic_year.substring(0, 4)) +
                                                    (semester == "All" || !contains_semester ? ""
                                                        : semester);
                                                setSemester(contains_semester ? semester : "All");
                                                //section term is the academic year + the semester, example = 2020 + S2
                                                //if empty, then academic year and semester selected value = All
                                                evaluate_and_apply(filters, section_term, "section_term", section_term);
                                                //section code must be reseted
                                                delete filters["section_code"];
                                                filterSections();
                                                setSelectedSection("All");
                                            }
                                            }
                                            inputProps={{ 'aria-label': 'Without label' }}>
                                            {(Object.keys(sectionsByInstructor[getInstructorName()].filtered_semesters)).map((year) => (
                                                <MenuItem value={year}>{year}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl sx={form_sx}>
                                        <label>Semester</label>
                                        <Select style={term_dropdown_style}
                                            value={semester}
                                            displayEmpty name="semester"
                                            onChange={(e) => {
                                                setSemester(e.target.value);
                                                let section_term = (academicYear == "All" ? "" : academicYear.substring(0, 4)) + (e.target.value == "All" ? "" : e.target.value);
                                                evaluate_and_apply(filters, section_term, "section_term", section_term);
                                                delete filters["section_code"];
                                                filterSections();
                                                setSelectedSection("All");
                                            }}
                                            inputProps={{ 'aria-label': 'Without label' }}>
                                            <MenuItem value="All">All</MenuItem>
                                            {sectionsByInstructor[getInstructorName()]
                                                .filtered_semesters[academicYear].map((entry) => (
                                                    <MenuItem value={entry.key}>{entry.value}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl disabled={academicYear == "All" || semester == "All"} sx={form_sx}>
                                        <label>Section</label>
                                        <Select style={term_dropdown_style}
                                            value={selectedSection}
                                            onChange={(e) => {
                                                let section = e.target.value;
                                                setSelectedSection(section);
                                                evaluate_and_apply(filters, section != "All", "section_code", section.section_code);

                                                if (selectedInstructor == "All" && section.instructors.length == 1) {
                                                    setSelectedInstructor(section.instructors[0]);
                                                    setSectionDisplayWarning(true);
                                                }

                                                filterSections();
                                            }}
                                            inputProps={{ 'aria-label': 'Without label' }}>
                                            <MenuItem value="All">All</MenuItem>
                                            {sectionsByInstructor[getInstructorName()].filtered_sections[filters.section_term]
                                                && sectionsByInstructor[getInstructorName()].filtered_sections[filters.section_term].map((value) =>
                                                    (<MenuItem value={value}>{value.section_code}</MenuItem>)
                                                )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item container lg={12}>
                                <CourseFeedback
                                    sections={filteredSections}
                                    section={selectedSection}
                                    instructor={selectedInstructor} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Snackbar open={instructorDisplayWarning} autoHideDuration={6000} onClose={() => setInstructorDisplayWarning(false)}>
                    <Alert onClose={() => setInstructorDisplayWarning(false)} severity="warning" sx={{ width: '100%' }}>
                        You just changed the instructor. Hence, the other applied filters have been cleared.
                    </Alert>
                </Snackbar>
                <Snackbar open={sectionDisplayWarning} autoHideDuration={6000} onClose={() => setSectionDisplayWarning(false)}>
                    <Alert onClose={() => setSectionDisplayWarning(false)} severity="warning" sx={{ width: '100%' }}>
                        The currently selected section only has one instructor. Hence, we have setted the instructor for you.
                    </Alert>
                </Snackbar>
            </Box>
        );
    }
    else {
        return (<div className="loader" >
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>);
    }
}