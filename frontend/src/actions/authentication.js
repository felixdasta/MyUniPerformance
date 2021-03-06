import axios from "axios";
import {url} from "../config.js"

export const login = async (userData) => {
    const response = await axios.post(url+'login', userData);
    return response;
}

export const send_activation_email = async (data) => {
    const response = await axios.post(url+'send-activation-email', data);
    return response;
}

export const signup = async (userData) => {
    const response = await axios.post(url+'students', userData);
    return response;
}