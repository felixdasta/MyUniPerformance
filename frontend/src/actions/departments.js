import axios from "axios";
import {url} from "../config.js";

export const get_departments_by_university = async (university_id) => {
    const response = await axios.get(url+'universities/' + university_id + '/departments');
    return response;
}

export const setUniversityDepartments = (selectedUniversity, setDepartments) => {
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