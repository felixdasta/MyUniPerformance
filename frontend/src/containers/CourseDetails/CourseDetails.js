import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import * as Loader from "react-loader-spinner";
import './CourseDetails.scss'
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, Text,
    PieChart, Pie, Cell
} from "recharts";
import { get_courses_by_id } from '../../actions/courses';

const semesters = {
    "S2": "Spring",
    "V1": "First Summer",
    "V2": "Second Summer",
    "S1": "Fall",
}

const COLORS = {"A's count": "#10E900", 
                "B's count": "#00FFBB", 
                "C's count": "#FFCD00", 
                "D's count": "#FF9A00", 
                "F's count": "#FF0000", 
                "P's count": "#009AFF", 
                "W's count": "#B5B5B5"};
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ percent }) => {
    return (`${(percent * 100).toFixed(0)}%`);
};

const formatTerm = value => {
    let year = parseInt(value.substring(0, 4));
    let semester = value.substring(4);
    year = semester == "S2" ? year + 1 : year;
    semester = semesters[semester];
    return semester + " " + year;
};

function getFilteredSections(sections, filters) {
    const capitalizeWords = (string) => {
        return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    };

    let matched_sections = []
    for (let section of sections) {
        let section_to_add = true;
        for (let key in filters) {
            if (key == 'page' || key == 'department_id' || key == 'course_code') {
                continue;
            }
            else if (key == 'section_term' && section.section_term.includes(filters[key])) {
                continue;
            }
            else if (key == 'instructor_name') {
                let includes_instructor = false;
                for (let instructor of section.instructors) {
                    if (capitalizeWords(instructor.name).includes(capitalizeWords(filters[key]))) {
                        includes_instructor = true;
                        break
                    }
                }
                section_to_add = includes_instructor;
            }
            else {
                section_to_add = false;
                break;
            }
        }

        if (section_to_add) {
            matched_sections.push(section);
        }
    }
    return matched_sections;
}

function getStats(sections) {
    let sections_student_count = []
    let sections_grade_stats = []
    let term_count_mapping = {}
    let grade_stats_mapping = {}
    for (let section of sections) {
        let student_count = term_count_mapping[section.section_term] ? term_count_mapping[section.section_term] : 0;
        for (let key in section.grades) {
            grade_stats_mapping[key] = grade_stats_mapping[key] ? grade_stats_mapping[key] + section.grades[key] : section.grades[key];
            student_count += section.grades[key]
        }
        if (student_count == 0) {
            delete term_count_mapping[section.section_term];
        }
        else {
            term_count_mapping[section.section_term] = student_count;
        }
    }
    for (let key in term_count_mapping) {
        sections_student_count.push({ name: formatTerm(key), "Enrolled students": term_count_mapping[key] });
    }

    let unnecesary_values = ['ib_count', 'ic_count', 'id_count', 'if_count'];

    for (let key in grade_stats_mapping) {
        let grade = key[0].toUpperCase();
        let count = grade_stats_mapping[key];
        if (!unnecesary_values.includes(key) && count > 0) {
            sections_grade_stats.push({ name: `${grade}'s count`, value: grade_stats_mapping[key] });
        }
    }
    return { grade_count: sections_grade_stats, student_count: sections_student_count };
}

export default function CourseDetails() {
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
    const [sections, setSections] = useState();
    const [filteredSections, setFilteredSections] = useState();
    const [filters, setFilters] = useState();
    const [studentsCount, setStudentsCount] = useState();
    const [gradesCount, setGradesCount] = useState();
    //for sections that have more than one instructor:
    const [selectedInstructor, setSelectedInstructor] = useState();

    useEffect(() => {
        let course = location.state.course;
        let filters = location.state.filters;

        //accomodate the sections that corresponds to the current course
        get_courses_by_id(course.course_id).then(response => {
            setSections(response.data.sections);
            setFilters(filters);
            setCourse(course);
        }).catch((error) => console.log(error));
    }, []);

    //retrieve sections that match criteria
    useEffect(() => {
        if (sections) {
            let filtered_sections = getFilteredSections(sections, filters);
            let stats = getStats(filtered_sections);
            setFilteredSections(filtered_sections);
            setStudentsCount(stats.student_count);
            setGradesCount(stats.grade_count);
            setSelectedInstructor(filtered_sections[0].instructors[0]);
        }
    }, [filters]);

    let avatar_style = {
        bgcolor: randomColor(),
        height: 150,
        width: 150,
        fontSize: 60,
    };

    if (course && sections) {
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
                        {studentsCount.length > 1 && <AreaChart
                            width={575}
                            height={400}
                            data={studentsCount}
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
                            <Area type="monotone" dataKey="Enrolled students" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>}
                    </div>

                    <div class='grade-container'>
                        <PieChart width={250} height={250}>
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
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (<div className="loader" >
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>);
    }

}