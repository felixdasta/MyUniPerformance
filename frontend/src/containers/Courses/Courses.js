import { React, useEffect, useState } from "react";
import { get_student_by_id } from '../../actions/user.js'
import { get_courses_by_university } from '../../actions/courses';
import { setUniversitySectionsTerms } from '../../actions/sections';
import { setUniversityDepartments } from '../../actions/departments';
import { useNavigate } from 'react-router-dom';
import Categories from "../../components/Categories/Categories";
import FilteredCoursesList from "../../components/FilteredCoursesList/FilteredCoursesList";
import * as Loader from "react-loader-spinner";
import './Courses.scss'

export default function Courses() {

    const [universities, setUniversities] = useState();
    const [courses, setCourses] = useState();
    const [departments, setDepartments] = useState();
    const [terms, setTerms] = useState();
    const [selectedUniversity, setSelectedUniversity] = useState();
    const [filteredData, setFilteredData] = useState();
    const [lastPage, setLastPage] = useState();

    let navigate = useNavigate();

    const setUniversityCourses = (setCourses, filteredData) => {
        //get university courses
        get_courses_by_university(selectedUniversity, filteredData).then(
            response => {
                setLastPage(response.data.last_page);
                setCourses(response.data.courses);
            }
        ).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {

        setFilteredData({ page: 1 });

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
            setUniversityCourses(setCourses, filteredData);
        }
    }, [selectedUniversity]);

    return (

        <div style={{ display: "flex" }}>
            {terms && departments && <Categories
                setFilteredData={(filteredData) => {
                    for (let key in filteredData) {
                        if (filteredData[key] == "") {
                            delete filteredData[key];
                        }
                    }
                    setCourses(null);
                    setFilteredData(filteredData);
                    setUniversityCourses(setCourses, filteredData);
                }}
                searchType={1}
                departments={departments}
                terms={terms} />}

            {courses ? <FilteredCoursesList courses={courses}
                filteredData={filteredData}
                setCourses={setUniversityCourses}
                lastPage={lastPage}
            />:
            <div className={terms && departments ? "custom-loader" : "loader"}>
                <Loader.ThreeDots color="black" height={120} width={120} />
            </div>}
        </div>
    )
}