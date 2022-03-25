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

function StudentProfile() {
  let loggedInUser = JSON.parse(localStorage.getItem("user"));

    return (
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography sx={{ fontSize: 36 }} align="center">
            {loggedInUser.first_name} {loggedInUser.last_name}
          </Typography>
          <Container align="center">
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{loggedInUser.first_name[0]}</Avatar>
          </Container>
          <Typography>  </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Name: {loggedInUser.first_name} {loggedInUser.last_name}
          </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Year of Admission: {loggedInUser.year_of_admission}
          </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Institutional Email: {loggedInUser.institutional_email}
          </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Credits:
          </Typography>
        </CardContent>
      </Card>
    );
}
export default StudentProfile;
