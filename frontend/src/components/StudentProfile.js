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

  return (
    <Card sx={{ width: 350, maxHeight: 500 }}>
      <CardContent>
        <Typography sx={{ fontSize: 36 }} align="center">
          {student.first_name} {student.last_name}
        </Typography>
        <Container align="center">
          <Avatar sx={{ bgcolor: deepOrange[500] }}>{student.first_name[0]}</Avatar>
        </Container>
        <Typography>  </Typography>
        <Typography sx={{ fontSize: 18 }} align="center">
          Name: {student.first_name} {student.last_name}
        </Typography>
        <Typography sx={{ fontSize: 18 }} align="center">
          Year of Admission: {student.year_of_admission}
        </Typography>
        <Typography sx={{ fontSize: 18 }} align="center">
          Institutional Email: {student.institutional_email}
        </Typography>
        <Typography sx={{ fontSize: 18 }} align="center">
          Credits Taken:
        </Typography>
      </CardContent>
    </Card>
  );

}
export default StudentProfile;
