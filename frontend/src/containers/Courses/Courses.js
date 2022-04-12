import { React, useEffect, useState } from "react";
import { get_student_by_id } from '../../actions/user.js'
import { get_courses_by_university } from '../../actions/courses';
import { get_sections_terms_by_university } from '../../actions/sections';
import { get_departments_by_university } from '../../actions/departments';
import { useNavigate } from 'react-router-dom';
import CoursesCategories from "../../components/CoursesCategories/CoursesCategories";
import UniversityCourses from "../../components/UniversityCourses/UniversityCourses";
import './Courses.scss'
import * as Loader from "react-loader-spinner";

export default function Courses() {

    const [universities, setUniversities] = useState();
    const [courses, setCourses] = useState();
    const [departments, setDepartments] = useState();
    const [terms, setTerms] = useState();
    const [selectedUniversity, setSelectedUniversity] = useState();
    const [page, setPage] = useState();

    let navigate = useNavigate();
    
    useEffect(() => {
        
        get_student_by_id(localStorage.getItem("user_id")).then(
            response => {
                let curriculums = response.data.curriculums;
                let universities = [];
                for (let i = 0; i < curriculums.length; i++) {
                    let curriculum = curriculums[i];
                    universities.push(curriculum.department.university);
                }
                setSelectedUniversity(universities[0]);
                setUniversities(universities);
            }
        ).catch((error) => {
            console.log(error.response.data);
            localStorage.removeItem("user_id");
            navigate("/");
        });
    }, []);

    useEffect(() => {
        if (selectedUniversity) {
            //initialize components
            setUniversitySectionsTerms(selectedUniversity, setTerms);
            setUniversityDepartments(selectedUniversity, setDepartments);
            setUniversityCourses(selectedUniversity, setPage, setCourses);
        }
    }, [selectedUniversity]);

    return (
        <div style={{ display: "flex"}}>
            {terms && departments && <CoursesCategories
                setFilteredData={(filteredData) => {
                    for (let key in filteredData) {
                        if (filteredData[key] == "") {
                            delete filteredData[key];
                        }
                    }
                    setCourses(null);
                    setUniversityCourses(selectedUniversity, setPage, setCourses, filteredData);
                }}

                departments={departments}
                terms={terms} />}

            {courses ? <UniversityCourses courses={courses} />:
                <div className = {terms && departments ? "custom-loader" : "loader"} >
                    <Loader.ThreeDots color="black" height={120} width={120} />
                </div>}
        </div>

    )
}

function setUniversitySectionsTerms(selectedUniversity, setTerms){
    //get university sections terms
    get_sections_terms_by_university(selectedUniversity).then(
        response => {
            let sections_terms = response.data.sections_terms;
            setTerms(sections_terms);
        }
    ).catch((error) => {
        console.log(error)
    });
}

function setUniversityDepartments(selectedUniversity, setDepartments){
    //get university departments
    get_departments_by_university(selectedUniversity).then(
        response => {
            let departments = response.data;
            let departments_map = new Map();

            for (let i = 0; i < departments.length; i++) {
                departments_map.set(departments[i].department_name, departments[i].department_id);
            }

            setDepartments(departments_map);
        }
    ).catch((error) => {
        console.log(error)
    });
}

function setUniversityCourses(selectedUniversity, setPage, setCourses, filteredData=null){
    //get university courses
    get_courses_by_university(selectedUniversity, filteredData).then(
        response => {
            setPage(response.data.current_page);
            setCourses(response.data.courses);
        }
    ).catch((error) => {
        console.log(error);
    });
}