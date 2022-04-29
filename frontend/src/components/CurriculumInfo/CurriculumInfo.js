import { React, useCallback, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Paper, Table, Typography } from "@mui/material";


function CurriculumInfo(props) {
  let student = props.student;

  if (student.curriculums) {
    let result = [];
    result.push(
      <Card sx={{ backgroundColor: "white", width: "100%", height: 350 }}>
        <CardContent>
          <Container align="center">
            <Typography sx={{ fontSize: 36 }} align="center">
              Curriculum Information
            </Typography>
          </Container>
          <Container>
            <Card sx={{ maxWidth: 600, height: 150, my: 3 }}>
              <Typography sx={{ fontSize: 18, my:1, mx:1 }}>
                Name: {student.curriculums[0].curriculum_name}
              </Typography >
              <Typography sx={{ fontSize: 18, my:1, mx:1 }}>
                Year: {student.curriculums[0].curriculum_year}
              </Typography>
              <Typography sx={{ fontSize: 18, my:1, mx:1 }}>
                Department: {student.curriculums[0].department.department_name}
              </Typography>
            </Card>
          </Container>
        </CardContent>
      </Card>
    );
    return result;
  }
}
export default CurriculumInfo;
