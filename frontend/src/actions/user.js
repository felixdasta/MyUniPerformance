import axios from "axios";
import {url} from "../config.js";

export const get_student_by_id = async (user_id) => {
    const response = await axios.get(url+'students/' + user_id);
    return response;
}