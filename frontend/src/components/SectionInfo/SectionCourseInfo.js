import { Card, CardContent, CardHeader } from "@mui/material";
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
            "code": props.section.section.course.course_code,
            "section": props.section.section.code,
        }
    }

    return (
        <Card sx={{ backgroundColor: "powderblue", width: 500, height: 350 }}>
            <CardHeader title={section.name} />
            <CardContent>
            </CardContent>
        </Card>
    );
}