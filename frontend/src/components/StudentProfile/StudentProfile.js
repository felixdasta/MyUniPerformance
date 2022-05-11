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
import {
  get_sections_grades_stats,
  calculate_gpa_based_on_counts
} from '../../actions/sections';
import { deepOrange, deepPurple } from "@mui/material/colors";
import { fontWeight } from "@mui/system";

function StudentProfile(props) {
  let student = props.student
  let takenCredits = 0;
  let honorPoints = 0;


  if (student.enrolled_sections) {
    {
      student.enrolled_sections.map((courseData) => {

        if(courseData.grade_obtained !== "F" || "W"){
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
    <Card sx={{width: 450, maxHeight: 500 }}>
      <CardContent>
        <Typography sx={{ fontSize: 36}} align="center">
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
