import axios from "axios";
import {url} from "../config.js";

export const like_feedback = async (feedback_id, student_id) => {
    const response = await axios.put(url+'students/' + student_id + '/feedbacks/' + feedback_id);
    return response;
}

export const unlike_feedback = async (feedback_id, student_id) => {
    const response = await axios.delete(url+'students/' + student_id + '/feedbacks/' + feedback_id);
    return response;
}

export const update_feedback = async (feedback_id, updated_feedback) => {
    const response = await axios.put(url+'feedbacks/' + feedback_id, updated_feedback);
    return response;
}

export const create_feedback = async (section_id, feedback) => {
    const response = await axios.post(url+'sections/' + section_id + "/feedbacks", feedback);
    return response;
}

export const delete_feedback = async (feedback_id) => {
    const response = await axios.delete(url+'feedbacks/' + feedback_id);
    return response;
}