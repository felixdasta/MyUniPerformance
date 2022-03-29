import axios from "axios";

let url = "http://127.0.0.1:8000/"

export const get_student_by_id = async (user_id) => {
    const response = await axios.get(url+'students/' + user_id);
    return response;
}