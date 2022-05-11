import axios from "axios";
import {url} from "../config.js";

export const get_curriculums_by_params = async (university_id) => {
    const response = await axios.get(url+'universities/'+university_id+'/curriculums');
    return response;
}