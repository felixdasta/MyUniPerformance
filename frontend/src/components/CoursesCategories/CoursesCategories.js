import { React, useEffect, useState } from "react";
import {
    Box, MenuItem, FormControl,
    Select, TextField, Button,
    Typography
} from '@mui/material'
import './CoursesCategories.scss'
import { green } from "@mui/material/colors";

let availableTerms = {};

const semesters = {
    "S2": "Spring Semester",
    "V1": "First Summer",
    "V2": "Second Summer",
    "S1": "Fall Semester",
}

function CoursesCategories(props) {

    const [filteredData, setFilteredData] = useState({
        section_term: "",
        department_id: "",
        instructor_name: "",
        course_code: ""
    });

    const [year, setYear] = useState("All");
    const [semester, setSemester] = useState("All");

    useEffect(()=> {
        for(let i = 0; i < props.terms.length; i++){
            let term = props.terms[i];
            let year = parseInt(term.substring(0, 4));
            let semester = term.substring(4, 6);
            
            //Example: 2016S2 in reality means spring semester of 2017
            if(semester == "S2"){
                year = year + 1;
            }

            //Example: does 2016 already have some semesters available?
            //push the newly found semester in the available ones!
            //otherwise, create a new array of available semesters
            //and add the only semester that is currently available
            let availableSemesters = availableTerms[year] ? availableTerms[year] : [];
            availableSemesters.push(semester);
            availableTerms[year] = availableSemesters;
        }

        //Sort the semesters in the following order: spring, first summer, second summer, fall
        for(let year in availableTerms){
            //Get available semesters of a given year
            let currentSemesters = availableTerms[year];
            let result = []
            for(let semester in semesters){
                //Does the available semesters of a given year includes this semester?
                if(currentSemesters.includes(semester)){
                    result.push(<MenuItem value={semester}>{semesters[semester]}</MenuItem>)
                }
            }
            availableTerms[year] = result;
        }

    }, []);

    const inputChange = (e) => {
        setFilteredData({ ...filteredData, [e.target.name]: e.target.value });
    };

    let form_sx = { m: 1, width: 295 }
    let term_dropdown_style = { backgroundColor: "white", height: 35, width: 140, fontSize: 14 }
    let dropdown_style = { backgroundColor: "white", height: 35, fontSize: 14 }
    let input_style = { backgroundColor: "white", fontSize: 14 }

    return (
        <div class="slide-right">
            <Box height="100vh" bgcolor="#F6F6F6" sx={{ width: 310, position: "sticky", top: 65}}> {props.terms && 
                <div class="term-container">
                    <FormControl sx={form_sx}>
                        <label>Year</label>
                        <Select style={term_dropdown_style} value={year} displayEmpty name="year" onChange={ (e) => { setYear(e.target.value) }} inputProps={{ 'aria-label': 'Without label' }}>
                            <MenuItem value="All">
                                <em>All</em>
                            </MenuItem> {(Object.keys(availableTerms)).map((year) => (
                                <MenuItem value={year}>{year}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <FormControl sx={form_sx}>
                        <label>Semester</label>
                        <Select style={term_dropdown_style} value={semester} displayEmpty name="semester" onChange={ (e) => { setSemester(e.target.value) }} inputProps={{ 'aria-label': 'Without label' }}>
                            <MenuItem value="All">
                                <em>All</em>
                            </MenuItem> 
                            {year != "All" ? availableTerms[year] : 
                                (Object.keys(semesters)).map((key) => (
                                <MenuItem value={key}>{semesters[key]}</MenuItem>))}
                        </Select>
                    </FormControl>
                </div>
                } {props.departments && <FormControl sx={form_sx}>
                <label>Department</label>
                <Select style={dropdown_style} value={filteredData.department_id} displayEmpty name="department_id" onChange={inputChange} inputProps={{ 'aria-label': 'Without label' }}>
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
            </FormControl>} <FormControl sx={form_sx}>
                    <label>Instructor Name</label>
                    <TextField name="instructor_name" onChange={inputChange} size="small" style={input_style} label="Type desired instructor name" variant="outlined" />
                </FormControl>
                <FormControl sx={form_sx}>
                    <label>Course Code</label>
                    <TextField name="course_code" onChange={inputChange} size="small" style={input_style} label="Type desired course code" variant="outlined" />
                </FormControl>
                <Typography align="center" sx={{ m: 5, color: green }}>
                    <Button onClick={() => { 
                            let fixed_year = semester == "S2" ? year - 1: year;
                            let section_term = (year == "All" ? "": fixed_year)+(semester == "All" ? "" : semester);
                            filteredData.section_term = section_term;
                            props.setFilteredData(Object.assign({}, filteredData))}} 
                            align='center' variant="contained">Apply Filters</Button>
                </Typography>
            </Box>
        </div>


    );

}
export default CoursesCategories;
