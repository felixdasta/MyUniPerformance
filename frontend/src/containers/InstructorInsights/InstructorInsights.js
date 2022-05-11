import {
    Grid, Avatar, Container,
    CardContent, Typography,
    Button, Card, Paper,
    CardActions
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useLocation } from 'react-router-dom';
import { get_instructors_by_id } from '../../actions/instructors';
import { get_students_count_by_term, get_sections_grades_stats } from '../../actions/sections';
import { get_courses_passing_rate, get_courses_number_of_semesters_offered } from "../../actions/courses";
import { randomColor, GRADE_COLORS } from '../../actions/utilities';
import { VscFeedback } from 'react-icons/vsc';
import { IoWarningOutline } from 'react-icons/io5';
import CourseFeedback from '../../components/CourseFeedback/CourseFeedback.js'
import InstructorCoursesModal from "../../components/InstructorCoursesModal/InstructorCoursesModal";
import * as Loader from "react-loader-spinner";
import {
    PieChart,
    Pie,
    Text,
    Tooltip,
    XAxis,
    YAxis,
    Area,
    AreaChart,
    ResponsiveContainer,
    Cell,
    BarChart,
    CartesianGrid,
    Legend,
    Bar,
} from "recharts";

const avatar_style = {
    bgcolor: randomColor(),
    height: 150,
    width: 150,
    fontSize: 60,
};

const top_grid_container_style = {
    height: "400px",
    width: "100%"
}

const bottom_grid_container_style = {
    height: "350px",
    width: "100%"
}

const renderCustomizedLabel = ({ percent }) => {
    return (`${(percent * 100).toFixed(0)}%`);
};

export default function InstructorDetails() {
    const [showInstructorCoursesModal, setShowInstructorCoursesModal] = useState(false);
    const openInstructorCoursesModal = () => setShowInstructorCoursesModal(true);
    const closeInstructorCoursesModal = () => setShowInstructorCoursesModal(false);

    const [instructor, setInstructor] = useState();
    const [courses, setCourses] = useState();
    const [sections, setSections] = useState();
    const location = useLocation();
    const [selectedCourse, setSelectedCourse] = useState();
    const [courseGraphs, setCourseGraphs] = useState();
    const [quickFactsGraphs, setQuickFactsGraphs] = useState();

    const enrolledStudentsAxisTick = (props) => {
        const { x, y, payload } = props;

        return <Text
            fontSize={12}
            x={x}
            y={y}
            width={20}
            textAnchor="middle"
            verticalAnchor="start"
            >{payload.value}
        </Text>
    }

    const quickFactsAxisTick = (props) => {
        const { x, y, payload } = props;

        return <Text
            fontSize={12}
            x={x}
            y={y}
            width={20}
            textAnchor="middle"
            verticalAnchor="start"
            angle={45}
            dy={20}
            dx={20}
            >{payload.value}
        </Text>
    }

    const getCourses = (sections) => {
        let unique_courses = {}
        for (let section of sections) {
            let course = section['course'];
            let unique_course = course['course_id'];
            if (!unique_courses[unique_course]) {
                unique_courses[unique_course] = course
                unique_courses[unique_course]['sections'] = []
            }
            unique_courses[unique_course]['sections'].push(section)
        }

        return Object.values(unique_courses);
    }

    const representQuickFacts = (courses) => {
        let most_given_courses = get_courses_number_of_semesters_offered(courses);
        let courses_passing_rate = get_courses_passing_rate(courses);
        let graphs = [];

        graphs.push(
            <Box>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                        width={250}
                        height={250}
                        data={most_given_courses}
                        margin={{
                            top: 0,
                            right: 50,
                            left: 0,
                            bottom: 25,
                        }}
                    >
                        <XAxis dataKey="name" tick={quickFactsAxisTick} interval={0} />
                        <YAxis />
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="top" align="center" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                            dataKey="Number of semesters offered"
                            fill="#8884d8"
                            background={{ fill: "#eee" }}
                            cx="50%"
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Typography sx={{ fontWeight: 400, fontSize: 16, marginTop: 2 }} align="center">Number of semesters the instructor has taught the course</Typography>

            </Box>);

        graphs.push(
            <Box>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                        width={250}
                        height={250}
                        data={courses_passing_rate}
                        margin={{ top: 0, right: 50, left: 0, bottom: 25 }}
                    >
                        <XAxis dataKey="name" tick={quickFactsAxisTick} interval={0}/>
                        <YAxis />
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="top" align="center" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                            dataKey="Passing rate"
                            fill="#8884d8"
                            background={{ fill: "#eee" }}
                            cx="50%"
                        />
                    </BarChart>
                </ResponsiveContainer>
                <Typography sx={{ fontWeight: 400, fontSize: 16, marginTop: 2 }} align="center">Percentage of students who pass the course</Typography>
            </Box>

        );

        setQuickFactsGraphs(graphs);
    }

    const representCourseStats = (course) => {
        let students_count_by_term = get_students_count_by_term(course.sections);
        let grades_count = get_sections_grades_stats(course.sections);
        let graphs = [];

        graphs.push(
            <Box>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart
                        width={250}
                        height={250}
                        margin={{
                            top: 0,
                            right: 50,
                            left: 0,
                            bottom: 25,
                        }}
                        data={students_count_by_term}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" axisLine={false} tick={enrolledStudentsAxisTick} interval={1} />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="Enrolled students" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
                <Typography sx={{ fontWeight: 400, fontSize: 16 }} align="center">Enrolled students by semester</Typography>
            </Box>);

        graphs.push(
            <Box>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            width={250}
                            height={250}
                            data={grades_count}
                            fill="#8884d8"
                            dataKey="value"
                            isAnimationActive={false}
                            label={renderCustomizedLabel}
                        >
                            {grades_count.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.name]}></Cell>
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <Typography sx={{ fontWeight: 400, fontSize: 16 }} align="center">Given grades in the course</Typography>
            </Box>
        )

        setCourseGraphs(graphs);
        setSelectedCourse(course);
    }

    useEffect(() => {
        let instructor = location.state.instructor;

        get_instructors_by_id(instructor.member_id).then(
            response => {
                let sections = response.data.sections;
                let courses = getCourses(sections);
                delete response.data["sections"];
                setInstructor(response.data);
                setSections(sections);
                setCourses(courses);
                representQuickFacts(courses);
            }
        ).catch((error) => {
            console.log(error.response.data)
        });
    }, []);

    if (instructor && sections && courses && quickFactsGraphs) {
        return (
            <Box sx={{ mx: 3, my: 3 }}>
                <Grid container rowGap={3}>
                    <InstructorCoursesModal instructor={instructor} courses={courses} open={showInstructorCoursesModal} handleClose={closeInstructorCoursesModal} />
                    {/* Top Row Container, each item container can be adjusted for width by changing lg*/}
                    <Grid container>
                        <Grid item container component={Paper} lg={4} justifyContent="center" sx={top_grid_container_style}>
                            <Grid item container justifyContent="center" lg={12}>
                                <Typography variant="h5">Quick Facts</Typography>
                            </Grid>
                            <Grid item container lg={12}>
                                <Carousel sx={{ width: "100%" }} interval={5000}>
                                    {quickFactsGraphs.map((GRAPH) => GRAPH)}
                                </Carousel>
                            </Grid>
                        </Grid>

                        <Grid item container lg={4}>

                            <Grid item component={Card} lg={12} sx={top_grid_container_style}>
                                <CardContent>
                                    <Typography variant="h5" component="div" align="center">
                                        {instructor.name}
                                    </Typography>
                                    {instructor.institutional_email &&
                                        <Typography variant="body2" align="center">
                                            Email: {instructor.institutional_email}
                                        </Typography>}
                                    <Typography variant="body2" align="center">
                                        Department: {instructor.department.department_name}
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        University: {instructor.department.university.university_name}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <Avatar className='instructor-avatar' sx={avatar_style}>{instructor.name[0]}</Avatar>
                                </CardContent>
                                <CardActions className="center-components">
                                    <Button
                                        onClick={openInstructorCoursesModal}
                                        variant="contained"
                                        size="large">
                                        <div style={{ display: "flex" }}>
                                            <div style={{ marginRight: 5 }}>
                                                Write Feedback
                                            </div>
                                            <VscFeedback size={18} style={{ marginTop: 2 }} />
                                        </div>
                                    </Button>
                                </CardActions>
                            </Grid>

                        </Grid>

                        <Grid item container lg={4}>
                            <Container component={Paper} sx={{ ...top_grid_container_style, backgroundColor: "#e5e5e5", overflow: "auto" }}>
                                <CourseFeedback sections={sections}
                                    instructor={instructor}
                                    section={"All"}
                                    sx={{
                                        margin: "auto",
                                        paddingTop: 3,
                                        alignItems: "center",
                                        fontSize: 14,
                                        width: '100%'
                                    }} />
                            </Container>

                        </Grid>
                    </Grid>

                    {/* Bottom Row Container */}
                    <Grid container>

                        <Grid item container component={Paper} lg={7} sx={{ ...bottom_grid_container_style, overflowY: "auto" }}>
                            <Grid item container lg={12} justifyContent="center">
                                <Typography sx={{ fontSize: 26, fontWeight: 'bold' }}>
                                    Courses
                                </Typography>
                            </Grid>

                            <Grid item container lg={12}>
                                {courses.map(course => (
                                    <Grid item justifyContent="center" container lg={6}>
                                        <Box sx={{ mx: 1, my: 1 }}>
                                            <Button
                                                style={course == selectedCourse
                                                    ? { backgroundColor: '#1976d2', color: 'white' } :
                                                    null} onClick={() => { representCourseStats(course) }}
                                                sx={{ width: "350px", height: "60px" }} variant="outlined">{course.course_code + ": " + course.course_name}</Button>
                                        </Box>
                                    </Grid>))}
                            </Grid>
                        </Grid>

                        <Grid item className={!selectedCourse ? "center-components": null}component={Paper} lg={5} sx={{ ...bottom_grid_container_style, backgroundColor: "#e5e5e5" }}>
                            {
                                selectedCourse ?
                                    <div>
                                        <Grid item container lg={12} justifyContent={"center"}>
                                            <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                                                {selectedCourse.course_code + ': ' + selectedCourse.course_name}
                                            </Typography>
                                        </Grid>
                                        <Grid item container lg={12}>
                                            <Carousel sx={{ width: "100%" }} interval={5000}>
                                                {courseGraphs.map((GRAPH) => GRAPH)}
                                            </Carousel>
                                        </Grid>
                                    </div> :
                                    <div>
                                        <Grid item container lg={12} justifyContent="center">
                                            <IoWarningOutline size={75} />
                                        </Grid>
                                        <Grid item container lg={12}>
                                            <Typography variant="h6">
                                                No course selected
                                            </Typography>
                                        </Grid>
                                    </div>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Box>);
    }
    return (
        <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>
    );
}