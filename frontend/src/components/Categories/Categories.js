import { React, useEffect, useState } from "react";
import {
    Box, MenuItem, FormControl,
    Select, TextField, Button,
    Typography
} from '@mui/material'
import './Categories.scss'
import { get_available_semesters_by_academic_year, semesters } from "../../actions/sections";

function Categories(props) {
    let [filters, setFilters] = useState({
        section_term: "",
        department_id: "",
        instructor_name: "",
        course_code: ""
    });

    const [academicYear, setAcademicYear] = useState("All");
    const [semester, setSemester] = useState("All");
    const [academicSemesters, setAvailableAcademicSemesters] = useState([]);

    useEffect(() => {
        let academic_semesters = get_available_semesters_by_academic_year(props.terms);
        setAvailableAcademicSemesters(academic_semesters);
    }, [props.terms]);

    const inputChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    let form_sx = { m: 1, width: 295 }
    let term_dropdown_style = { backgroundColor: "white", height: 35, width: 140, fontSize: 14 }
    let dropdown_style = { backgroundColor: "white", height: 35, fontSize: 14 }
    let input_style = { backgroundColor: "white", fontSize: 14 }

    return (
        <Box height="100vh" className="slide-right" bgcolor="#F6F6F6" sx={{ width: 310, position: "sticky", top: 0, fontSize: 14 }}>
            {academicSemesters
                && <div>
                    <div class="term-container">
                        <FormControl sx={form_sx}>
                            <label>Academic Year</label>
                            <Select style={term_dropdown_style}
                                value={academicYear} displayEmpty
                                name="year"
                                onChange={(e) => {
                                    setAcademicYear(e.target.value);
                                    //assume that the selected year doesn't contains the selected academic semester
                                    let contains_semester = false;
                                    {
                                        academicSemesters[e.target.value] &&
                                            academicSemesters[e.target.value].map((entry) => contains_semester = entry.key == semester ? true : contains_semester)
                                    }
                                    setSemester(contains_semester ? semester : 'All')
                                }
                                }
                                inputProps={{ 'aria-label': 'Without label' }}>
                                <MenuItem value="All">
                                    <em>All</em>
                                </MenuItem> {(Object.keys(academicSemesters)).map((year) => (
                                    <MenuItem value={year}>{year}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl sx={form_sx}>
                            <label>Semester</label>
                            <Select style={term_dropdown_style}
                                value={semester}
                                displayEmpty name="semester"
                                onChange={(e) => { setSemester(e.target.value) }}
                                inputProps={{ 'aria-label': 'Without label' }}>
                                <MenuItem value="All">
                                    <em>All</em>
                                </MenuItem>
                                {academicYear != "All" ? academicSemesters[academicYear].map((entry) => (
                                    <MenuItem value={entry.key}>{entry.value}</MenuItem>
                                )) :
                                    (Object.keys(semesters)).map((key) => (
                                        <MenuItem value={key}>{semesters[key]}</MenuItem>))}
                            </Select>
                        </FormControl>
                    </div>
                    <FormControl sx={form_sx}>
                        <label>Department</label>
                        <Select style={dropdown_style}
                            value={filters.department_id}
                            displayEmpty name="department_id"
                            onChange={inputChange}
                            inputProps={{ 'aria-label': 'Without label' }}>
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {Array.from(props.departments, ([key, value]) => {
                                let result = [];
                                if (!key.includes("or") && !key.includes("Other")) {
                                    result.push((<MenuItem value={value}>{key}</MenuItem>));
                                }
                                return result;
                            })
                            }
                        </Select>
                    </FormControl>
                    <FormControl sx={form_sx}>
                        <TextField label="Instructor name"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            name="instructor_name"
                            size="small"
                            placeholder={
                                props.searchType == 1 ? "Search courses by instructor name" : 
                                props.searchType == 2 ? "Search instructor by name" : ""}
                            style={input_style}
                            onChange={inputChange} />
                    </FormControl>
                    <FormControl sx={form_sx}>
                        <TextField label="Course code"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            name="course_code"
                            size="small"
                            placeholder={
                                props.searchType == 1 ? "Search courses by code" : 
                                props.searchType == 2 ? "Search instructors by course code" : ""}
                            style={input_style}
                            onChange={inputChange} />
                    </FormControl>
                    <Typography align="center" sx={{ m: 5 }}>
                        <Button onClick={() => {
                            let year = academicYear.substring(0, 4);
                            let section_term = (year == "All" ? "" : year) + (semester == "All" ? "" : semester);
                            filters.section_term = section_term;
                            filters.page = 1;
                            props.setFilteredData(Object.assign({}, filters))
                        }}
                            align='center' variant="contained">Apply Filters</Button>
                    </Typography>
                </div>}
        </Box>
    );

}
export default Categories;
