import axios from "axios";

let url = "http://127.0.0.1:8000/"

export const get_sections_terms_by_university = async (university_id) => {
    const response = await axios.get(url+'universities/' + university_id + '/sections-terms');
    return response;
}