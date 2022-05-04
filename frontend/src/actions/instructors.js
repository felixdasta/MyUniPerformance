import axios from "axios";
import {url} from "../config.js";

export const get_instructors_by_university = async (university_id, filteredData=null) => {
    const response = await axios.get(url+'universities/' + university_id + '/instructors', {params: filteredData});
    return response;
}

export const get_instructors_by_id= async (instructor_id) => {
    const response = await axios.get(url+'instructors/' + instructor_id);
    return response;
}

export const contains_instructor = (instructors, value) =>{
    for(let instructor of instructors){
        if(value === instructor.name){
            return true;
        }
    }
    return false;
}