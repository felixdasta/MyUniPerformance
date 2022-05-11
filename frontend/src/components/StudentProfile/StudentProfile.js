import * as React from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Icon,
  Container,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";

function StudentProfile(props) {
  let student = props.student
  let takenCredits = 0;
  let honorPoints = 0;

  if (student.enrolled_sections) {
    {
      let student_dept_id = student.curriculums[0].department.department_id;
      student.enrolled_sections.map((courseData) => {
        let course_dept_id = courseData.section.course.department.department_id;
        let grade = courseData.grade_obtained;
        if (student_dept_id == course_dept_id
          && (grade !== "F" && grade !== "D" && grade !== "W")) {
          takenCredits += courseData.section.course.course_credits;
        }
        else if (student_dept_id != course_dept_id
          && (grade !== "F" && grade !== "W")) {
          takenCredits += courseData.section.course.course_credits;
        }

        switch (courseData.grade_obtained) {
          case "A":
            honorPoints = honorPoints + (4 * courseData.section.course.course_credits)
            break;
          case "B":
            honorPoints = honorPoints + (3 * courseData.section.course.course_credits)
            break;
          case "C":
            honorPoints = honorPoints + (2 * courseData.section.course.course_credits)
            break;
          case "D":
            honorPoints = honorPoints + (1 * courseData.section.course.course_credits)
            break;
          case "F":
            honorPoints = honorPoints + (0 * courseData.section.course.course_credits)
            break;
          case "W":
            break;
          default:
            break;
        }
      });

    }

  }

  return (
    <Card sx={{ width: "100%", maxHeight: 500 }}>
      <CardContent>
        <Typography sx={{ fontSize: 36 }} align="center">
          {student.first_name} {student.last_name}
        </Typography>
        <Container align="center">
          <Avatar sx={{ bgcolor: deepOrange[500] }}>{student.first_name[0]}</Avatar>
        </Container>
        <Typography sx={{ fontSize: 18 }} align="center">
          Year of Admission: {student.year_of_admission}
        </Typography>
        <Typography sx={{ fontSize: 18 }} align="center">
          Email: {student.institutional_email}
        </Typography>
        <Typography sx={{ fontSize: 18 }} align="center">
          Credits Approved: {takenCredits}
        </Typography>
      </CardContent>
    </Card>
  );

}
export default StudentProfile;
