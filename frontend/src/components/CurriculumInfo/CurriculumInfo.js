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
} from "@mui/material";
import { Paper, Table, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import CoursesCategories from "../../components/CoursesCategories/CoursesCategories";
import {
  get_available_semesters_by_academic_year,
  semesters,
} from "../../actions/sections";
import axios from "axios";
import { ResponsiveContainer } from "recharts";
import { Box } from "@mui/system";

function CurriculumInfo(props){
    let student = props.student;
    



} export default (CurriculumInfo);