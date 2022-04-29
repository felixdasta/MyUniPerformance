import {
    Grid, Avatar, Card,
    CardContent, Typography, Button
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

    useEffect(() => {
        let instructor = location.state.instructor;

        get_instructors_by_id(instructor.member_id).then(
            response => {
                setCourses(response.data.courses);

                let unified_sections = [];
                response.data.courses.map(course => {
                    course.sections.map(section => unified_sections.push(section));
                });

                delete response.data["courses"];
                setSections(unified_sections);
                setInstructor(response.data);
            }
        ).catch((error) => {
            console.log(error.response.data)
        });
    }, []);

    if (instructor && sections) {
        return (<Box sx={{ mx: 3, my: 3 }}> <Grid container spacing={0} columnSpacing={3} rowGap={3}>
            {instructor && <InstructorCoursesModal instructor={instructor} courses={courses} open={showInstructorCoursesModal} handleClose={closeInstructorCoursesModal} />}
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
                    <Grid item component={Box} xs={12} sx={{ height: "200px" }}>
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
                        </Button>                    </Grid>
                </Grid>
                <Grid item container
                    sx={{
                        height: "400px",
                        overflowY: "auto",
                        padding: 0
                    }}
                    lg={4}
                    style={{ backgroundColor: "#e5e5e5" }}
                    component={Card}>
                    <CourseFeedback sections={sections}
                        instructor={instructor}
                        section={"All"}
                        sx={{
                            margin: "auto",
                            padding: 3,
                            alignItems: "center",
                            fontSize: 12
                        }} />
                </Grid>
            </Grid>

            {/* Bottom Row Container */}
            <Grid item container lg={12} justifyContent="center">
                <Grid item component={Box} lg={7} sx={{ backgroundColor: "blueviolet", height: "350px" }}> Course list </Grid>
                <Grid item component={Box} lg={5} sx={{ backgroundColor: "navajowhite", height: "350px" }}> Course info </Grid>
            </Grid>
        </Grid></Box>)
    }
    return (
        <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>
    );
}