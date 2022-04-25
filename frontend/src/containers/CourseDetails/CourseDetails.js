import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import * as Loader from "react-loader-spinner";
import './CourseDetails.scss';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, Text,
    PieChart, Pie, Cell
} from "recharts";
import { get_courses_by_id } from '../../actions/courses';
import {
    get_available_sections_filters,
    get_filtered_sections,
    get_stats,
    year_contains_academic_semester,
    evaluate_and_apply,
    instructor_teached_year
} from "../../actions/sections";
import {
    Box, MenuItem, FormControl,
    Select, TextField, Button,
    Typography
} from '@mui/material';
import { randomColor } from '../../actions/utilities';
import CourseFeedback from "../../components/CourseFeedback/CourseFeedback";

const COLORS = {
    "A's count": "#10E900",
    "B's count": "#2FDECC",
    "C's count": "#FFCD00",
    "D's count": "#FF9A00",
    "F's count": "#FF0000",
    "P's count": "#009AFF",
    "W's count": "#B5B5B5"
};
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ percent }) => {
    return (`${(percent * 100).toFixed(0)}%`);
};

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

    const location = useLocation();
    const [course, setCourse] = useState();
    const [sections, setSections] = useState();
    const [studentsCountByTerm, setStudentsCountByTerm] = useState();
    const [studentsCountByInstructor, setStudentsCountByInstructor] = useState();
    const [gradesCount, setGradesCount] = useState();
    let [filters, setFilters] = useState();

    //criterias that will be used to filter sections
    const [instructorName, setInstructorName] = useState("All");
    const [instructorId, setInstructorId]= useState("All");
    const [academicYear, setAcademicYear] = useState("All");
    const [semester, setSemester] = useState("All");
    const [selectedSection, setSelectedSection] = useState("All");
    const [sectionsByInstructor, setSectionsByInstructor] = useState({});

    //for course feedback
    const [filteredSections, setFilteredSections] = useState();

    const filterSections = () => {
        let filtered_sections = get_filtered_sections(sections, filters);
        let stats = get_stats(filtered_sections);
        setStudentsCountByTerm(stats.student_count_by_term);
        setStudentsCountByInstructor(stats.student_count_by_instructor);
        setGradesCount(stats.grade_count);
        setFilteredSections(filtered_sections);

        if(filtered_sections.length == 1){
            setSelectedSection(filtered_sections[0]);
        }
        if (filters.instructor_name) {
            setInstructorName(() => {
                for(let section of filtered_sections){
                    for(let instructor of section.instructors){
                        if(instructor.name.toUpperCase().indexOf(filters.instructor_name.toUpperCase()) != -1){
                            setInstructorId(instructor.member_id);
                            return instructor.name;
                        }
                    }
                }
                setInstructorId("All");
                return "All";
            });
        }
    }

    useEffect(() => {
        let course = location.state.course;
        let filters = location.state.filters;

        //accomodate the sections that corresponds to the current course
        get_courses_by_id(course.course_id).then(response => {
            let selection_filters = get_available_sections_filters(response.data.sections);
            setSectionsByInstructor(selection_filters)
            setSections(response.data.sections);
            setFilters(filters);

            //example: if section_term == 2020S2 or section_term == 2020, then year = 2020
            let academic_year = filters.section_term
                && filters.section_term.length >= 4
                ? filters.section_term.substring(0, 4) : "All";

            //but the academic year will be 2020-2021
            academic_year = academic_year == "All" ? academic_year : academic_year + "-" + (parseInt(academic_year) + 1);
            setAcademicYear(academic_year);

            //example: if section_term == 2020S2 or section_term == S2, then semester = S2
            setSemester((filters.section_term
                && filters.section_term.length == 6)
                ? filters.section_term.substring(4, 6) :
                (filters.section_term
                    && filters.section_term.length == 2)
                    ? filters.section_term :
                    "All");

            setCourse(course);
        }).catch((error) => console.log(error));
    }, []);

    //retrieve sections that match criteria
    useEffect(() => {
        if (sections && instructorName) {
            filterSections();
        }

    }, [filters]);

    let avatar_style = {
        bgcolor: randomColor(),
        height: 150,
        width: 150,
        fontSize: 60,
    };

    let form_sx = { m: 1, width: 295 }
    let term_dropdown_style = { backgroundColor: "white", height: 35, width: 140, fontSize: 14 }

    if (course && sections) {
        return (
            <div>
                <div class='course-insights'>

                    {instructorName && instructorName != "All" ?
                        <div class='instructor-container'>
                            <Avatar className='instructor-avatar' sx={avatar_style}>{instructorName[0]}</Avatar>
                            <div style={{ fontWeight: 'bold' }}>Instructor name:</div>
                            <div>{instructorName}</div>
                        </div> : selectedSection && selectedSection != "All" 
                        &&  <div class='instructor-container'>
                            <Avatar className='instructor-avatar' sx={avatar_style}>{selectedSection.instructors[0].name[0]}</Avatar>
                            <div style={{ fontWeight: 'bold' }}>Instructor name:</div>
                            <div>{selectedSection.instructors[0].name}</div>
                        </div>
                    }

                    <div class='graph-container'>
                        <div style={{ fontWeight: 'bold' }}>{course.course_code}: {course.course_name}</div>
                        {(studentsCountByTerm.length > 1 || studentsCountByInstructor.length > 1) && <AreaChart
                            width={575}
                            height={400}
                            data={(academicYear != "All" && semester != "All") ? studentsCountByInstructor : studentsCountByTerm}
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
                <div class="term-container">
                    <FormControl sx={form_sx}>
                        <label>Instructor name</label>
                        <Select style={term_dropdown_style}
                            value={instructorName} displayEmpty
                            name="instructor"
                            onChange={(e) => {
                                let instructor = e.target.value;
                                setInstructorName(instructor);
                                //did the instructor teached at the currently selected year?
                                //if not, set academic year to "All"
                                let teached_year = instructor_teached_year(academicYear, sectionsByInstructor[instructor]);
                                let fixed_year = teached_year ? academicYear : "All";
                                setAcademicYear(fixed_year);

                                //did the instructor teached at the currently selected semester at the given year?
                                let contains_semester = year_contains_academic_semester(fixed_year,
                                    semester,
                                    sectionsByInstructor[instructor]);

                                let section_term = (fixed_year == "All" ? ""
                                    : fixed_year.substring(0, 4)) +
                                    (semester == "All" || !contains_semester ? ""
                                        : semester);

                                setSemester(contains_semester ? semester : "All");
                                evaluate_and_apply(filters, section_term, "section_term", section_term);
                                evaluate_and_apply(filters, instructor != "All", "instructor_name", instructor);
                                filterSections();
                                setSelectedSection("All");

                            }
                            }
                            inputProps={{ 'aria-label': 'Without label' }}>
                            {(Object.keys(sectionsByInstructor)).map((instructor) => (
                                <MenuItem value={instructor}>{instructor}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <FormControl sx={form_sx}>
                        <label>Academic Year</label>
                        <Select style={term_dropdown_style}
                            value={academicYear} displayEmpty
                            name="year"
                            onChange={(e) => {
                                let academic_year = e.target.value;
                                setAcademicYear(academic_year);
                                let contains_semester = year_contains_academic_semester(
                                    academic_year,
                                    semester,
                                    sectionsByInstructor[instructorName]);
                                let section_term = (academic_year == "All" ? ""
                                    : academic_year.substring(0, 4)) +
                                    (semester == "All" || !contains_semester ? ""
                                        : semester);
                                setSemester(contains_semester ? semester : "All");
                                //section term is the academic year + the semester, example = 2020 + S2
                                //if empty, then academic year and semester selected value = All
                                evaluate_and_apply(filters, section_term, "section_term", section_term);
                                //section code must be reseted
                                delete filters["section_code"];
                                filterSections();
                                setSelectedSection("All");
                            }
                            }
                            inputProps={{ 'aria-label': 'Without label' }}>
                            {(Object.keys(sectionsByInstructor[instructorName].filtered_semesters)).map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <FormControl sx={form_sx}>
                        <label>Semester</label>
                        <Select style={term_dropdown_style}
                            value={semester}
                            displayEmpty name="semester"
                            onChange={(e) => {
                                setSemester(e.target.value);
                                let section_term = (academicYear == "All" ? "" : academicYear.substring(0, 4)) + (e.target.value == "All" ? "" : e.target.value);
                                evaluate_and_apply(filters, section_term, "section_term", section_term);
                                delete filters["section_code"];
                                filterSections();
                                setSelectedSection("All");
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}>
                            <MenuItem value="All">All</MenuItem>
                            {sectionsByInstructor[instructorName]
                                .filtered_semesters[academicYear].map((entry) => (
                                    <MenuItem value={entry.key}>{entry.value}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl disabled = {academicYear == "All" || semester == "All"} sx={form_sx}>
                        <label>Section</label>
                        <Select style={term_dropdown_style}
                            value={selectedSection}
                            onChange={(e) => {
                                let section = e.target.value; 
                                setSelectedSection(section);
                                evaluate_and_apply(filters, section != "All", "section_code", section.section_code);
                                filterSections();
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}>
                            <MenuItem value="All">All</MenuItem>
                            {sectionsByInstructor[instructorName].filtered_sections[filters.section_term]
                                && sectionsByInstructor[instructorName].filtered_sections[filters.section_term].map((value) =>
                                    (<MenuItem value={value}>{value.section_code}</MenuItem>)
                                )}
                        </Select>
                    </FormControl>
                </div>
                <CourseFeedback sections={filteredSections} section={selectedSection} instructor_id={instructorId}/>
            </div>
        )
    }
    else {
        return (<div className="loader" >
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>);
    }
}