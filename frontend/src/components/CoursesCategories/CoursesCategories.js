import { React, useEffect, useState } from "react";
import {
    Box, MenuItem, FormControl,
    Select, TextField, Button,
    Typography
} from '@mui/material'
import './CoursesCategories.scss'
import { green } from "@mui/material/colors";

function CoursesCategories(props) {

    const [filteredData, setFilteredData] = useState({
        section_term: "",
        department_id: "",
        instructor_name: "",
        course_code: ""
    })

    const inputChange = (e) => {
        setFilteredData({ ...filteredData, [e.target.name]: e.target.value });
    };

    let form_sx = { m: 1, width: 295 }
    let dropdown_style = { backgroundColor: "white", height: 35, fontSize: 14 }
    let input_style = { backgroundColor: "white", fontSize: 14 }

    return (
        <div class="slide-right">
            <Box height="100vh" bgcolor="#F6F6F6" sx={{ width: 310, position: "sticky", top: 65}}> {props.terms && <FormControl sx={form_sx}>
                <label>Academic Semester</label>
                <Select style={dropdown_style} value={filteredData.section_term} displayEmpty name="section_term" onChange={inputChange} inputProps={{ 'aria-label': 'Without label' }}>
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem> {(props.terms).map((term) => (
                        <MenuItem value={term}>{term}</MenuItem>))}
                </Select>
            </FormControl>} {props.departments && <FormControl sx={form_sx}>
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
                    <Button onClick={() => { props.setFilteredData(Object.assign({}, filteredData)) }} align='center' variant="contained">Apply Filters</Button>
                </Typography>
            </Box>
        </div>


    );

}
export default CoursesCategories;
