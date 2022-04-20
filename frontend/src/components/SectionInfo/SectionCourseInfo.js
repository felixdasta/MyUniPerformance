import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Box, Typography, IconButton, Tooltip } from "@mui/material";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Text, ResponsiveContainer
} from "recharts";
import { Tooltip as Rechtool } from "recharts";
import { get_courses_by_id } from '../../actions/courses';
import { get_stats, get_filtered_sections } from "../../actions/sections";
import { useNavigate } from "react-router-dom";

export default function SectionCourseInfo(props) {
    const [sections, setSections] = useState([props.section.section]);
    const [studentsCountByTerm, setStudentsCountByTerm] = useState();
    let navigate = useNavigate();

    let section = {
        "name": "None",
    }
    if (props.section) {
        section = {
            "name": props.section.section.course.course_name,
            "course_code": props.section.section.course.course_code,
            "section_code": props.section.section.section_code,
        }
    }

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

    const viewCourseDetails = () => {
        navigate('details', {
            state: {
                course: {
                    course_id: props.section.section.course.course_id,
                    course_name: props.section.section.course.course_name,
                    course_code: props.section.section.course.course_code,
                },
                filters: {
                    instructor_name: props.section.section.instructors[0].name,
                    department_id: props.section.section.course.department.department_id,
                    section_term: "all",
                    course_code: props.section.section.course.course_code,
                },
            }
        });
    }

    useEffect(() => {
        get_courses_by_id(props.section.section.course.course_id).then(response => {
            setSections(response.data.sections)
        })
    }, [props.section])

    useEffect(() => {
        let filtered_sections = get_filtered_sections(sections, { 'instructor_name': props.section.section.instructors[0].name });
        let stats = get_stats(filtered_sections);
        setStudentsCountByTerm(stats.student_count_by_term);
    }, [sections])

    return (
        <Card sx={{ backgroundColor: "white", width: 500, height: 350 }}>
            <CardHeader
                title={
                    <Typography sx={{ fontSize: 27 }} align="left">
                        {section.name}
                    </Typography>
                }
                action={
                    <Tooltip title="View in course page">
                        <IconButton onClick={viewCourseDetails}>
                            <OpenInNewOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                }
                color="primary"
                subheader={
                    <div>
                        <Typography variant="body1">
                            <Box sx={{ fontWeight: 'bold' }} display="inline">Course Code: </Box>
                            <Box sx={{ fontWeight: 'regular' }} display="inline">{section.course_code}</Box>
                        </Typography>
                        <Typography variant="body1">
                            <Box sx={{ fontWeight: 'bold' }} display="inline">Section Code: </Box>
                            <Box sx={{ fontWeight: 'regular' }} display="inline">{section.section_code}</Box>
                        </Typography>
                    </div>
                }
            />
            <CardContent>
                <ResponsiveContainer width='100%' height={200}>
                    <AreaChart
                        data={studentsCountByTerm}
                        margin={{
                            top: 0, right: 30, left: 0, bottom: 20
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" axisLine={false} tick={CustomizedAxisTick} />
                        <YAxis />
                        <Rechtool />
                        <Area type="monotone" dataKey="Enrolled students" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}