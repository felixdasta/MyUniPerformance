import axios from "axios";

let url = "http://127.0.0.1:8000/"

export const login = async (userData) => {
    const response = await axios.post(url+'login', userData);
    return response;
}