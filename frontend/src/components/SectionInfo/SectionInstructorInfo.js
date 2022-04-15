import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";

export default function SectionInstructorInfo(props) {
    let instructor = {
        "name": "none",
    }
    if (props.instructor) {
        instructor = {
            "name": props.instructor[0].name,
        }
    }

    return (
        <Card sx={{ backgroundColor: "powderblue", width: 500, height: 350 }}>
            <CardHeader title={instructor.name} />
            <CardContent>
            </CardContent>
        </Card>
    );
}