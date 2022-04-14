import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";

export default function SectionProfInfo(props) {
    let section = {
        "name": "None",
    }
    if (props.section) {
        section = {
            "name": props.section.section.course.course_name,
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