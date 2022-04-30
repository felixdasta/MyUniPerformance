import {
    Grid, Avatar, Container,
    CardContent, Typography,
    Button, Card, Paper
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { get_instructors_by_id } from '../../actions/instructors';
import { randomColor } from '../../actions/utilities';
import { VscFeedback } from 'react-icons/vsc';
import CourseFeedback from '../../components/CourseFeedback/CourseFeedback.js'
import InstructorCoursesModal from "../../components/InstructorCoursesModal/InstructorCoursesModal";
import * as Loader from "react-loader-spinner";

let avatar_style = {
    bgcolor: randomColor(),
    height: 200,
    width: 200,
    fontSize: 60,
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

    useEffect(() => {
        let instructor = location.state.instructor;

        get_instructors_by_id(instructor.member_id).then(
            response => {
                let sections = response.data.sections;
                delete response.data["sections"];
                setInstructor(response.data);
                setSections(sections);
                setCourses(getCourses(sections));
            }
        ).catch((error) => {
            console.log(error.response.data)
        });
    }, []);

    if (instructor && sections && courses) {
        return (<Box sx={{ mx: 3, my: 3 }}> <Grid container spacing={0} columnSpacing={3} rowGap={3}>
            <InstructorCoursesModal instructor={instructor} courses={courses} open={showInstructorCoursesModal} handleClose={closeInstructorCoursesModal} />
            {/* Top Row Container, each item container can be adjusted for width by changing lg*/}
            <Grid item container lg={12} justifyContent="center" columnSpacing={3}>
                <Grid item container lg={4} justifyContent="center">
                    <Grid item component={Box} lg={12} sx={{ height: "250px" }}>
                        <Card sx={{ height: "250px" }} >
                            <CardContent>
                                <Typography sx={{ fontSize: 26 }} align="center">
                                    {instructor.name}
                                </Typography>
                                {instructor.institutional_email &&
                                    <Typography sx={{ fontSize: 14 }} align="center">
                                        Email: {instructor.institutional_email}
                                    </Typography>}
                                <Typography sx={{ fontSize: 14 }} align="center">
                                    Department: {instructor.department.department_name}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} align="center">
                                    University: {instructor.department.university.university_name}
                                </Typography>
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>
                <Grid item container lg={4} justifyContent='center' style={{ height: "400px" }}>
                    <Grid item xs={12} sx={{ height: "200px" }}>
                        <Avatar className='instructor-avatar' sx={avatar_style}>{instructor.name[0]}</Avatar>
                    </Grid>
                    <Grid className="center-components" item component={Box} xs={12} sx={{ height: "200px" }}>
                        <Button
                            onClick={openInstructorCoursesModal}
                            variant="contained"
                            className="course-insights"
                        >
                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: 2.5 }}>
                                    Write Feedback
                                </div>
                                <VscFeedback size={18} style={{ marginTop: 2 }} />
                            </div>
                        </Button>
                    </Grid>
                </Grid>
                <Grid item container
                    sx={{
                        height: "400px",
                        overflowY: "auto",
                    }}
                    lg={4}>
                    <Container component={Paper} sx={{ backgroundColor: "#e5e5e5" }}>
                        <CourseFeedback sections={sections}
                            instructor={instructor}
                            section={"All"}
                            sx={{
                                margin: "auto",
                                paddingTop: 3,
                                alignItems: "center",
                                fontSize: 12,
                                width: '100%'
                            }} />
                    </Container>

                </Grid>
            </Grid>

            {/* Bottom Row Container */}
            <Grid item container lg={12} justifyContent="center">
                <Grid component={Paper} item lg={7} sx={{ height: "350px", overflowY: "auto" }}>
                    <Container sx={{ backgroundColor: "white" }}>
                        <Typography sx={{ fontSize: 26, fontWeight: 'bold' }} align="center">
                            Courses
                        </Typography>
                        <Grid item container lg={12}>
                            {courses.map(course => (
                                <Grid item container lg={6}>
                                    <Box sx={{ mx: 1, my: 1 }}>
                                        <Button onClick={() => setSelectedCourse(course)} sx={{ width: "25vw", height: "4vw" }} variant="outlined">{course.course_code + ": " + course.course_name}</Button>
                                    </Box>
                                </Grid>))}
                        </Grid>

                    </Container>
                </Grid>
                <Grid item component={Paper} lg={5} sx={{ backgroundColor: "#e5e5e5", height: "350px" }}>
                    <Container>
                        {
                            selectedCourse &&
                            <Typography sx={{ fontSize: 20, fontWeight: 'bold' }} align="center">
                                {selectedCourse.course_code + ': ' + selectedCourse.course_name}

                            </Typography>
                        }
                    </Container>

                </Grid>
            </Grid>
        </Grid></Box>)
    }
    return (
        <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>
    );
}