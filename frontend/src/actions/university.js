import axios from "axios";
import {url} from "../config.js";

export const get_university_by_params = async (filteredData) => {
    const response = await axios.get(url+'universities', {params: filteredData});
    return response;
}