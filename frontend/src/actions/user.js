import axios from "axios";
import {url} from "../config.js";

export const get_student_by_id = async (user_id) => {
    const response = await axios.get(url+'students/' + user_id);
    return response;
}

export const update_student_by_id = async (user_id, params) => {
    const response = await axios.put(url+'students/' + user_id, params);
    return response;
}

export const get_university_by_id = async (university_id) => {
    const response = await axios.get(url + 'universities/' + university_id);
    return response;
}