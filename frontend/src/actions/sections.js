import axios from "axios";
import { url } from "../config.js";

export const semesters = {
    "V1": "First Summer",
    "V2": "Second Summer",
    "S1": "Fall Semester",
    "S2": "Spring Semester",
}

const formatTerm = value => {
    let year = parseInt(value.substring(0, 4));
    let semester = value.substring(4);
    year = semester == "S2" ? year + 1 : year;
    semester = semesters[semester];
    return semester + " " + year;
};

export const get_available_semesters_by_academic_year = (terms) => {
    let response = {};
    for (let i = 0; i < terms.length; i++) {
        let term = terms[i];
        let year = parseInt(term.substring(0, 4));
        let semester = term.substring(4, 6);

        //Example: 2016S2 in reality means spring semester of academic year 2016-2017
        year = year + "-" + (year + 1);

        //Example: does 2016 already have some semesters available?
        //push the newly found semester in the available ones!
        //otherwise, create a new array of available semesters
        //and add the only semester that is currently available
        let available_semesters = response[year] ? response[year] : [];
        available_semesters.push(semester);
        response[year] = available_semesters;
    }

    //Sort the semesters in the following order: spring, first summer, second summer, fall
    for (let academic_year in response) {
        //Get available semesters of a given year
        let current_semesters = response[academic_year];
        let result = []
        for (let semester in semesters) {
            //Does the available semesters of a given year includes this semester?
            if (current_semesters.includes(semester)) {
                result.push({ key: semester, value: semesters[semester] })
            }
        }
        response[academic_year] = result;
    }
    return response;
}

export const get_available_sections_filters = (sections) => {
    const add_value = (object, key, value) => {
        let result = object[key] ? object[key] : [];
        result.push(value);
        object[key] = result;
    }

    //initialize universal values
    let instructors_sections_response = { "All": { filtered_semesters: {}, filtered_sections: {} } };
    sections.sort((a, b) => a.section_term.localeCompare(b.section_term));

    for (let section of sections) {
        let year = parseInt(section.section_term.substring(0, 4));
        let academic_semester = section.section_term.substring(4, 6);

        //Example: 2016S2 in reality means spring semester of academic year 2016-2017
        year = year + "-" + (year + 1);

        //filter all available years, semesters and sections for a given course from all instructors
        let all_instructors = instructors_sections_response["All"];

        //consider every year
        add_value(all_instructors.filtered_semesters, "All", academic_semester);
        //consider the specific year
        add_value(all_instructors.filtered_semesters, year, academic_semester);
        //add the sections to the corresponding academic term
        add_value(all_instructors.filtered_sections, section.section_term, section);

        //filter all available years, semesters and sections for a given course from an instructor
        for (let instructor of section.instructors) {
            //in case that we need to initialized the value
            instructors_sections_response[instructor.name] =
                instructors_sections_response[instructor.name] ?
                    instructors_sections_response[instructor.name] :
                    { filtered_semesters: {}, filtered_sections: {} };

            let some_instructor = instructors_sections_response[instructor.name];

            //consider every year
            add_value(some_instructor.filtered_semesters, "All", academic_semester);
            //consider the specific year
            add_value(some_instructor.filtered_semesters, year, academic_semester);
            //add the sections to the corresponding academic term
            add_value(some_instructor.filtered_sections, section.section_term, section);
        }
    }

    for (let instructor in instructors_sections_response) {
        let semesters_response = instructors_sections_response[instructor].filtered_semesters
        for (let year in semesters_response) {
            //Get available semesters of a given year
            let current_semesters = semesters_response[year];
            let result = []
            for (let semester in semesters) {
                //Does the available semesters of a given year includes this semester?
                if (current_semesters.includes(semester)) {
                    result.push({ key: semester, value: semesters[semester] })
                }
            }
            semesters_response[year] = result;
        }
    }

    return instructors_sections_response;
}

export const get_filtered_sections = (sections, filters) => {


    let matched_sections = []
    for (let section of sections) {
        let section_to_add = true;
        for (let key in filters) {
            if (key == 'page' || key == 'department_id' || key == 'course_code') {
                continue;
            }
            else if ((key == 'section_term' && section.section_term.includes(filters[key]))
                || (key == 'section_code' && section.section_code == filters[key])) {
                continue;
            }
            else if (key == 'instructor_name') {
                let includes_instructor = false;
                for (let instructor of section.instructors) {
                    if (instructor.name.toUpperCase().indexOf(filters[key].toUpperCase()) != -1) {
                        includes_instructor = true;
                        break
                    }
                }
                section_to_add = includes_instructor;
            }
            else {
                section_to_add = false;
                break;
            }
        }

        if (section_to_add) {
            matched_sections.push(section);
        }
    }
    return matched_sections;
}

export const evaluate_and_apply = (filters, condition, key, value) => {
    if (condition) {
        filters[key] = value;
    }
    else {
        delete filters[key];
    }
}

export const get_students_count_by_term = (sections) => {
    let sections_student_count_by_term = []
    let term_count_mapping = {}
    for (let section of sections) {
        let term_student_count = term_count_mapping[section.section_term] ? term_count_mapping[section.section_term] : 0;
        for (let grade in section.grades) {
            term_student_count += section.grades[grade];
        }
        //we don't want to add empty sections!
        if (term_student_count > 0) {
            term_count_mapping[section.section_term] = term_student_count;
        }
    }
    for (let section_term in term_count_mapping) {
        sections_student_count_by_term.push({ name: formatTerm(section_term), "Enrolled students": term_count_mapping[section_term], term: section_term });
    }

    sections_student_count_by_term.sort((a, b) => a.term.localeCompare(b.term));
    return sections_student_count_by_term;
}

export const get_students_count_by_instructor = (sections) => {
    let sections_student_count_by_instructor = []
    let instructor_count_mapping = {}
    for (let section of sections) {
        for (let grade in section.grades) {
            for (let instructor of section.instructors) {
                let instructor_student_count = instructor_count_mapping[instructor.name] ? instructor_count_mapping[instructor.name] : 0;
                instructor_student_count += section.grades[grade];

                //update the enrolled students of a given instructor only if we summed more enrolled students
                if (instructor_student_count > 0) {
                    instructor_count_mapping[instructor.name] = instructor_student_count;
                }
            }
        }
    }
    for (let instructor in instructor_count_mapping) {
        sections_student_count_by_instructor.push({ name: instructor, "Enrolled students": instructor_count_mapping[instructor] });
    }

    sections_student_count_by_instructor.sort((a, b) => a.name.localeCompare(b.name));
    return sections_student_count_by_instructor;
}

export const get_sections_grades_stats = (sections) => {
    let sections_grade_stats = []
    let grade_stats_mapping = {}
    for (let section of sections) {
        for (let grade in section.grades) {
            grade_stats_mapping[grade] = grade_stats_mapping[grade] ? grade_stats_mapping[grade] + section.grades[grade] : section.grades[grade];
        }
    }

    let unnecesary_values = ['ib_count', 'ic_count', 'id_count', 'if_count'];

    for (let grade in grade_stats_mapping) {
        let grade_as_upper = grade[0].toUpperCase();
        let count = grade_stats_mapping[grade];
        if (!unnecesary_values.includes(grade) && count > 0) {
            sections_grade_stats.push({ name: `${grade_as_upper}'s count`, value: grade_stats_mapping[grade] });
        }
    }
    return sections_grade_stats;
}

export const year_contains_academic_semester = (year, semester, sections) => {
    let contains_semester = false;
    {
        sections.filtered_semesters[year] &&
            sections.filtered_semesters[year]
                .map((entry) => contains_semester = entry.key == semester ? true : contains_semester);
    }
    return contains_semester;
}

export const instructor_teached_year = (year, sections_by_instructor) => {
    return sections_by_instructor.filtered_semesters[year] != null;
}

export const get_sections_terms_by_university = async (university_id) => {
    const response = await axios.get(url + 'universities/' + university_id + '/sections-terms');
    return response;
}

export const get_section_info_by_id = async (section_id) => {
    const response = await axios.get(url + 'sections/' + section_id);
    return response;
}

export const enroll_student_or_update_grade = async (student_id, section_id, grade_obtained) => {
    const response = await axios.put(url + 'students/' + student_id + '/sections/' + section_id, {
        student_id: student_id,
        section_id: section_id,
        grade_obtained: grade_obtained
    });
    return response;
}

export const setUniversitySectionsTerms = (selectedUniversity, setTerms) => {
    //get university sections terms
    get_sections_terms_by_university(selectedUniversity).then(
        response => {
            let sections_terms = response.data.sections_terms;
            setTerms(sections_terms);
        }
    ).catch((error) => {
        console.log(error)
    });
}

export const calculate_gpa_based_on_counts = (grades_count) => {
    let grades = {};

    for (let grade of grades_count) {
        grades[grade.name] = grade.value;
    }

    let aCount = grades["A's count"] ? grades["A's count"] : 0;
    let bCount = grades["B's count"] ? grades["B's count"] : 0;
    let cCount = grades["C's count"] ? grades["C's count"] : 0;
    let dCount = grades["D's count"] ? grades["D's count"] : 0;
    let fCount = grades["F's count"] ? grades["F's count"] : 0;

    return ((aCount * 4 + bCount * 3 + cCount * 2 + dCount * 1) / (aCount + bCount + cCount + dCount + fCount)).toFixed(2);
}

export const get_specified_semester = (section_term) => {
    return (section_term && section_term.length == 6) ? section_term.substring(4, 6) :
        (section_term && section_term.length == 2) ? section_term : "All";
}

export const get_specified_year = (section_term) => {
    return (section_term && section_term.length >= 4) ? section_term.substring(0, 4) : "All";
}

export const get_specified_academic_year = (year) => {
    return year == "All" ? year : year + "-" + (parseInt(year) + 1);
}