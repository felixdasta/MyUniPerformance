import axios from "axios";

let url = "http://127.0.0.1:8000/"

export const semesters = {
    "V1": "First Summer",
    "V2": "Second Summer",
    "S1": "Fall Semester",
    "S2": "Spring Semester",
}

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
    const add_value = (object, key, value) =>{
        let result = object[key] ? object[key] : [];
        result.push(value);
        object[key] = result;
    }

    //initialize universal values
    let instructors_sections_response = {"All": {filtered_semesters: {}, filtered_sections: {}}};

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
        for(let instructor of section.instructors){
            //in case that we need to initialized the value
            instructors_sections_response[instructor.name] = 
            instructors_sections_response[instructor.name] ? 
            instructors_sections_response[instructor.name] : 
            {filtered_semesters: {}, filtered_sections: {}};

            let some_instructor = instructors_sections_response[instructor.name];

            //consider every year
            add_value(some_instructor.filtered_semesters, "All", academic_semester);
            //consider the specific year
            add_value(some_instructor.filtered_semesters, year, academic_semester);
            //add the sections to the corresponding academic term
            add_value(some_instructor.filtered_sections, section.section_term, section); 
        }
    }

    for(let instructor in instructors_sections_response){
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

export const get_stats = (sections) => {
    const formatTerm = value => {
        let year = parseInt(value.substring(0, 4));
        let semester = value.substring(4);
        year = semester == "S2" ? year + 1 : year;
        semester = semesters[semester];
        return semester + " " + year;
    };

    let sections_student_count_by_term = []
    let sections_student_count_by_instructor = []
    let sections_grade_stats = []
    let term_count_mapping = {}
    let instructor_count_mapping = {}
    let grade_stats_mapping = {}
    for (let section of sections) {
        let term_student_count = term_count_mapping[section.section_term] ? term_count_mapping[section.section_term] : 0;
        for (let key in section.grades) {
            //Retrieve each on the individual grades of each section, and add it to the overall grade count of every section
            //Example: there are two sections, 1 from instructor Fred and 1 from instructor Ted
            //Fred gve 10 F's
            //Ted gave 5 F's
            //Hence, total F's count = 15
            grade_stats_mapping[key] = grade_stats_mapping[key] ? grade_stats_mapping[key] + section.grades[key] : section.grades[key];
            //Example: an instructor gave 2 A's, 2 B's, 2 C's, 2 D's, 2 F's and 1 student dropped from the section
            //Another instructor gave 1 A, 1 B, 1 C, 1 D, 1 F and nobody dropped from the section
            //Both instructor gave the same course in the same term
            //Hence, total student count between both sections = 16
            term_student_count += section.grades[key];
            //Apply the previous logic, but with every section that has been given by the same instructor
            for (let instructor of section.instructors) {
                let instructor_student_count = instructor_count_mapping[instructor.name] ? instructor_count_mapping[instructor.name] : 0;
                instructor_student_count += section.grades[key];

                //update the enrolled students of a given instructor only if we summed more enrolled students
                if (instructor_student_count > 0) {
                    instructor_count_mapping[instructor.name] = instructor_student_count;
                }
            }
        }
        //we don't want to add empty sections!
        if (term_student_count > 0) {
            term_count_mapping[section.section_term] = term_student_count;
        }
    }
    for (let key in term_count_mapping) {
        sections_student_count_by_term.push({ name: formatTerm(key), "Enrolled students": term_count_mapping[key] });
    }
    for (let key in instructor_count_mapping) {
        sections_student_count_by_instructor.push({ name: key, "Enrolled students": instructor_count_mapping[key] });
    }

    let unnecesary_values = ['ib_count', 'ic_count', 'id_count', 'if_count'];

    for (let key in grade_stats_mapping) {
        let grade = key[0].toUpperCase();
        let count = grade_stats_mapping[key];
        if (!unnecesary_values.includes(key) && count > 0) {
            sections_grade_stats.push({ name: `${grade}'s count`, value: grade_stats_mapping[key] });
        }
    }
    return {
        grade_count: sections_grade_stats,
        student_count_by_term: sections_student_count_by_term,
        student_count_by_instructor: sections_student_count_by_instructor
    };
}

export const year_contains_academic_semester = (year, semester, sections) =>{
    let contains_semester = false;
    {
        sections.filtered_semesters[year] &&
        sections.filtered_semesters[year]
        .map((entry) => contains_semester = entry.key == semester ? true : contains_semester);
    }
    return contains_semester;
}

export const instructor_teached_year = (year, sections_by_instructor) =>{
    return sections_by_instructor.filtered_semesters[year] != null;
}

export const get_sections_terms_by_university = async (university_id) => {
    const response = await axios.get(url + 'universities/' + university_id + '/sections-terms');
    return response;
}