import { Card, CardContent, CardHeader, CardActions, Button, Typography } from "@mui/material";
import React from "react";

export default function SectionCourseInfo(props) {
    /* What do we need for section:
    * course name
    * course code
    * course section
    * enrolled student count
    * like timeline graph
    * link to course page 
    */
    let section = {
        "name": "None",
    }
    if (props.section) {
        section = {
            "name": props.section.section.course.course_name,
            "course_code": props.section.section.course.course_code,
            "code": props.section.section.section_code,
        }
    }

    return (
        <Card sx={{ backgroundColor: "white", width: 500, height: 350 }}>
            <CardHeader title={section.name} />
            <CardContent>
                <Typography variant="body2">
                    {section.course_code} {section.code}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="small"
                    color="info"
                    disableElevation="true" >
                    Course Page
                </Button>
            </CardActions>
        </Card>
    );
}