import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import './CourseDetails.scss'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Text
} from "recharts";

export default function CourseDetails() {

    const semesters = {
        "S2": "Spring",
        "V1": "First Summer",
        "V2": "Second Summer",
        "S1": "Fall",
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

    const randomColor = () => {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        let color = "#" + hex.toString(16);
        return color;
    }

    const location = useLocation();
    const [course, setCourse] = useState();
    const [filters, setFilters] = useState();
    const [selectedSection, setSelectedSection] = useState();
    const [historicalCount, setHistoricalCount] = useState();
    //for sections that have more than one instructor:
    const [selectedInstructor, setSelectedInstructor] = useState();

    const formatTerm = value => {
        let year = parseInt(value.substring(0, 4));
        let semester = value.substring(4);
        year = semester == "S2" ? year + 1 : year;
        semester = semesters[semester];
        return semester + " " + year;
    };

    useEffect(() => {
        let course = location.state.course;
        let filters = location.state.filters;
        let selected_section = location.state.course.sections[0];
        let historical_count = [];

        setCourse(course);
        setFilters(filters);
        setSelectedSection(selected_section);

        let term_count_mapping = {}

        for (let section of course.sections) {
            let student_count = term_count_mapping[section.section_term] ? term_count_mapping[section.section_term] : 0;
            for (let key in section.grades) {
                student_count += section.grades[key]
            }
            if(student_count > 0){
                term_count_mapping[section.section_term] = student_count;
            }
            else{
                delete term_count_mapping[section.section_term]
            }
        }

        for (let key in term_count_mapping) {
            let count = term_count_mapping[key];
            historical_count.push({ name: formatTerm(key), "Student Count": count });
        }

        setHistoricalCount(historical_count);

        if (filters.instructor_name) {
            for (let instructor of selected_section.instructors) {
                if (instructor.name.includes(filters.instructor_name)) {
                    setSelectedInstructor(instructor);
                    break;
                }
            }
        }
        else {
            setSelectedInstructor(location.state.course.sections[0].instructors[0]);
        }

    }, []);

    let avatar_style = {
        bgcolor: randomColor(),
        height: 150,
        width: 150,
        fontSize: 60,
    };

    if (course) {
        return (
            <div>
                <div class='course-insights'>
                    <div class='instructor-container'>
                        <Avatar className='instructor-avatar' sx={avatar_style}>{selectedInstructor.name[0]}</Avatar>
                        <div style={{ fontWeight: 'bold' }}>Instructor name:</div>
                        <div>{selectedInstructor.name}</div>
                    </div>

                    <div class='graph-container'>
                        <div style={{ fontWeight: 'bold' }}>{course.course_code}: {course.course_name}</div>
                        {historicalCount.length > 1 && <AreaChart
                            width={575}
                            height={400}
                            data={historicalCount}
                            margin={{
                                top: 25,
                                right: 0,
                                left: 0,
                                bottom: 25
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" axisLine={false} tick={CustomizedAxisTick} />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="Student Count" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>}
                    </div>

                    <div class='grade-container'>
                        {/*                         <PieChart width={400} height={400}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart> */}
                    </div>
                </div>
            </div>
        )
    }
    else {
        return null;
    }

}