import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    semesters,
    get_specified_year,
    get_specified_academic_year,
    get_specified_semester
} from '../../actions/sections';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

let dropdown_style = { backgroundColor: "white", height: 35, width: 280, fontSize: 14 }

export default function InstructorCoursesModal(props) {
    const format_academic_year_and_semester = (term) => (
        get_specified_academic_year(get_specified_year(term)) + ': ' + semesters[get_specified_semester(term)]
    );

    let navigate = useNavigate();

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sectionsByTerms, setSectionsByTerm] = useState(null);
    const [sectionsBySpecifiedTerm, setSectionsBySpecifiedTerm] = useState(null);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    const reset_parameters = () => {
        setSelectedCourse(null);
        setSectionsByTerm(null);
        setSectionsBySpecifiedTerm(null);
        setSelectedTerm(null);
        setSelectedSection(null);
    }

    const write_feedback = () => {
        reset_parameters();
        navigate('../courses/details', {
            state: {
                course: selectedCourse,
                filters: {
                    instructor_name: props.instructor.name,
                    section_term: selectedTerm,
                    section_code: selectedSection.section_code
                }
            }
        });
    }

    const populateTerms = (e) => {
        let course = e.target.value;
        let course_offered_years = {}

        for (let section of course.sections) {
            let section_term = section.section_term;

            let sections_by_term =
            course_offered_years[section_term] ?
            course_offered_years[section_term] : []

            sections_by_term.push(section);

            course_offered_years[section_term] = sections_by_term;
        }

        course_offered_years = Object.keys(course_offered_years).sort().reduce(function (acc, key) { 
            acc[key] = course_offered_years[key];
            return acc;
        }, {});

        setSectionsByTerm(course_offered_years);
        setSelectedCourse(course);
    }

    const populateSections = (e) => {
        let term = e.target.value;
        setSectionsBySpecifiedTerm(sectionsByTerms[term]);
        setSelectedTerm(term);
    }


    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.open}
                onClose={props.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Want to leave a feedback?
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            Select the course in which you wish to leave a feedback:
                        </Typography>
                        <FormControl>
                            <Select
                                disabled={selectedCourse}
                                style={dropdown_style}
                                value={selectedCourse}
                                displayEmpty
                                name="course"
                                onChange={populateTerms}
                                inputProps={{ 'aria-label': 'Without label' }}>
                                <MenuItem value={null}>
                                    <em>Select course...</em>
                                </MenuItem>
                                {props.courses.map(course => (
                                    <MenuItem value={course}>
                                        {course.course_code + ' - ' + course.course_name}
                                    </MenuItem>)
                                )}
                            </Select>
                        </FormControl>
                        {sectionsByTerms && <div>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                Select the year and semester in which you took the course:
                            </Typography>
                            <FormControl>
                                <Select
                                    disabled={selectedTerm}
                                    style={dropdown_style}
                                    value={selectedTerm}
                                    displayEmpty
                                    name="course"
                                    onChange={populateSections}
                                    inputProps={{ 'aria-label': 'Without label' }}>
                                    <MenuItem value={null}>
                                        <em>Select year and semester...</em>
                                    </MenuItem>
                                    {(Object.keys(sectionsByTerms)).map((term) => (
                                        <MenuItem value={term}>{
                                            format_academic_year_and_semester(term)
                                        }</MenuItem>))}
                                </Select>
                            </FormControl>
                        </div>}
                        {sectionsBySpecifiedTerm && <div>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                Select the section of the specified year and semester:
                            </Typography>
                            <FormControl>
                                <Select
                                    style={dropdown_style}
                                    value={selectedSection}
                                    displayEmpty
                                    name="course"
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    inputProps={{ 'aria-label': 'Without label' }}>
                                    <MenuItem value={null}>
                                        <em>Select section...</em>
                                    </MenuItem>
                                    {sectionsBySpecifiedTerm.map((section) => (
                                        <MenuItem value={section}>{
                                            section.section_code
                                        }</MenuItem>))}
                                </Select>
                            </FormControl>
                        </div>}

                        <div style={{ display: "flex", marginTop: 20 }}>
                            <Button onClick={reset_parameters} style={{ marginRight: 10 }} variant="contained" disabled={!selectedCourse}>Reset Parameters</Button>
                            <Button onClick={write_feedback} variant="contained" disabled={!selectedSection}>Write Feedback</Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}