import axios from "axios";
import {url} from "../config.js";

export const get_courses_by_university = async (university_id, filteredData=null) => {
    const response = await axios.get(url+'universities/' + university_id + '/courses', {params: filteredData});
    return response;
}

export const get_courses_by_id= async (course_id) => {
    const response = await axios.get(url+'courses/' + course_id);
    return response;
}