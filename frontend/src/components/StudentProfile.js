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
import { createTheme } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider } from "@emotion/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { deepOrange, deepPurple } from "@mui/material/colors";

function StudentProfile(props) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [yearOfAdmin, setYearofAdmin] = useState("");
  const [institEmail, setInstitEmail] = useState("");

  const userQuery = useQuery("user", async () => {
    const { data } = await axios.get(
      "http://127.0.0.1:8000/students/37b03faa-4725-458d-aebb-8f7399102508"
    );
    setName(data.first_name);
    setLastName(data.last_name);
    setYearofAdmin(data.year_of_admission);
    setInstitEmail(data.institutional_email);
    return data;
  });

  if (userQuery.isLoading) {
    console.log("Student Profile Query is loading");
    return (
      <div>
        <Typography>Loading...</Typography>
      </div>
    );
  } else {
    return (
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography sx={{ fontSize: 36 }} align="center">
            {name} {lastName}
          </Typography>
          <Container align="center">
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{name[0]}</Avatar>
          </Container>
          <Typography>  </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Name: {name} {lastName}
          </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Year of Admission: {yearOfAdmin}
          </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Institutional Email: {institEmail}
          </Typography>
          <Typography sx={{ fontSize: 18 }} align="center">
            Credits:
          </Typography>
        </CardContent>
      </Card>
    );
  }
}
export default StudentProfile;
