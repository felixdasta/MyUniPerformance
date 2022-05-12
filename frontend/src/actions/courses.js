import axios from "axios";
import {url} from "../config.js";

export const get_courses_by_university = async (university_id, filteredData=null) => {
    const response = await axios.get(url+'universities/' + university_id + '/courses', {params: filteredData});
    return response;
}

export const get_courses_by_department_id = async (department_id) => {
    const response = await axios.get(url+'departments/' + department_id + '/courses');
    return response;
}

export const get_courses_by_id= async (course_id) => {
    const response = await axios.get(url+'courses/' + course_id);
    return response;
}

export const get_courses_number_of_semesters_offered = (courses) => {
    let most_given_courses = [];

    for (let course of courses) {
        let course_count_by_term = new Set();
        for (let section of course.sections) {
            course_count_by_term.add(section.section_term);
        }
        let result = { name: course.course_code, "Number of semesters offered": course_count_by_term.size };
        most_given_courses.push(result);
    }

    most_given_courses.sort((a, b) => a["Number of semesters offered"] - b["Number of semesters offered"]);
    return most_given_courses;
}

export const get_courses_passing_rate = (courses) => {
    let courses_passing_rate = [];
    let passing_grades = new Set();
    passing_grades.add("a_count");
    passing_grades.add("b_count");
    passing_grades.add("c_count");
    passing_grades.add("p_count");
    passing_grades.add("ib_count");
    passing_grades.add("ic_count");

    for (let course of courses) {
        let total_count = 0;
        let passing_count = 0;
        for (let section of course.sections) {
            for (let grade in section.grades) {
                total_count += section.grades[grade];

                if (passing_grades.has(grade)) {
                    passing_count += section.grades[grade];
                }
            }
        }
        let result = { name: course.course_code, "Passing rate": (passing_count / total_count).toPrecision(2) };
        
        if(result["Passing rate"] != "NaN"){
            courses_passing_rate.push(result);
        }
    }

    courses_passing_rate.sort((a, b) => a["Passing rate"] - b["Passing rate"]);
    return courses_passing_rate;
}