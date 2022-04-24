import axios from "axios";
import {url} from "../config.js";

export const get_departments_by_university = async (university_id) => {
    const response = await axios.get(url+'universities/' + university_id + '/departments');
    return response;
}