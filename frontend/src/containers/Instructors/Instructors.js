import { React, useEffect, useState } from "react";
import { get_student_by_id } from '../../actions/user.js'
import { get_instructors_by_university } from '../../actions/instructors';
import { setUniversitySectionsTerms } from '../../actions/sections';
import { setUniversityDepartments } from '../../actions/departments';
import { useNavigate } from 'react-router-dom';
import Categories from "../../components/Categories/Categories";
import FilteredInstructorsList from "../../components/FilteredInstructorsList/FilteredInstructorsList.js";
import * as Loader from "react-loader-spinner";

export default function Instructors() {
    const [universities, setUniversities] = useState();
    const [instructors, setInstructors] = useState();
    const [departments, setDepartments] = useState();
    const [terms, setTerms] = useState();
    const [selectedUniversity, setSelectedUniversity] = useState();
    const [filteredData, setFilteredData] = useState();
    const [lastPage, setLastPage] = useState();

    let navigate = useNavigate();

    const setUniversityInstructors = (setInstructors, filteredData) => {
        //get university courses
        get_instructors_by_university(selectedUniversity, filteredData).then(
            response => {
                setLastPage(response.data.last_page);
                setInstructors(response.data.instructors);
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
            setUniversityInstructors(setInstructors, filteredData);
        }
    }, [selectedUniversity]);


    return (
        instructors && terms && departments ?
        <div style={{ display: "flex" }}>
            <Categories
                setFilteredData={(filteredData) => {
                    for (let key in filteredData) {
                        if (filteredData[key] == "") {
                            delete filteredData[key];
                        }
                    }
                    setInstructors(null);
                    setFilteredData(filteredData);
                    setUniversityInstructors(setInstructors, filteredData);
                }}
                searchType={2}
                departments={departments}
                terms={terms} />

            <FilteredInstructorsList instructors={instructors}
                filteredData={filteredData}
                setInstructors={setUniversityInstructors}
                lastPage={lastPage}
            />
        </div> :
        <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>
    );

        /*<Box sx={{ mx: 3, my: 3 }}> {student ? <Grid container spacing={0} columnSpacing={3} rowGap={3}>
            {Top Row Container, each item container can be adjusted for width by changing lg}
            <Grid item container lg={3} justifyContent="center">
                <Grid item component={Box} lg={12} sx={{ backgroundColor: "powderblue", height: "700px" }}> Search Filters </Grid>
            </Grid>
            <Grid item container lg={9} justifyContent="center">
                <Grid item component={Box} lg={12} sx={{ backgroundColor: "crimson", height: "900px" }}> Instructor List </Grid>
            </Grid>
            <Grid item container lg={2} justifyContent="center">
                <Grid item component={Button} lg={12} onClick={viewInstructorDetails}> Details </Grid>
            </Grid>
        </Grid> : 
        <div className="loader">
            <Loader.ThreeDots color="black" height={120} width={120} />
        </div>
        }</Box>*/

}