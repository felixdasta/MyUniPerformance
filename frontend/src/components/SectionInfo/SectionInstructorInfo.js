import { Card, Grid, CardContent, Typography, CardHeader, IconButton, Tooltip as MuiTooltip } from "@mui/material";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import React from "react";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { get_instructors_by_id } from "../../actions/instructors";
import * as Loader from "react-loader-spinner";
import {
  get_courses_passing_rate,
  get_courses_number_of_semesters_offered,
} from "../../actions/courses";
import { useNavigate } from "react-router-dom";

import {
  Text,
  Tooltip as RechartTooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";

function SectionInstructorInfo(props) {
  const [quickFactsGraphs, setQuickFactsGraphs] = useState();
  let navigate = useNavigate();

  const getCourses = (sections) => {
    let unique_courses = {};
    for (let section of sections) {
      let course = section["course"];
      let unique_course = course["course_id"];
      if (!unique_courses[unique_course]) {
        unique_courses[unique_course] = course;
        unique_courses[unique_course]["sections"] = [];
      }
      unique_courses[unique_course]["sections"].push(section);
    }

    return Object.values(unique_courses);
  };

  const quickFactsAxisTick = (props) => {
    const { x, y, payload } = props;

    return (
      <Text
        fontSize={12}
        x={x}
        y={y}
        width={20}
        textAnchor="middle"
        verticalAnchor="start"
        angle={45}
        dy={20}
        dx={20}
      >
        {payload.value}
      </Text>
    );
  };

  const representQuickFacts = (courses) => {
    let most_given_courses = get_courses_number_of_semesters_offered(courses);
    let courses_passing_rate = get_courses_passing_rate(courses);
    let graphs = [];

    graphs.push(
      <Box>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            width={250}
            height={250}
            data={most_given_courses}
            margin={{
              top: 0,
              right: 50,
              left: 0,
              bottom: 25,
            }}
          >
            <XAxis dataKey="name" tick={quickFactsAxisTick} interval={0} />
            <YAxis />
            <RechartTooltip />
            <Legend layout="horizontal" verticalAlign="top" align="center" />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="Number of semesters offered"
              fill="#8884d8"
              background={{ fill: "#eee" }}
              cx="50%"
            />
          </BarChart>
        </ResponsiveContainer>
        <Typography
          sx={{ fontWeight: 400, fontSize: 16, marginTop: 2 }}
          align="center">
          Number of semesters the instructor has taught a given course
        </Typography>
      </Box>
    );

    graphs.push(
      <Box>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            width={250}
            height={250}
            data={courses_passing_rate}
            margin={{ top: 0, right: 50, left: 0, bottom: 25 }}
          >
            <XAxis dataKey="name" tick={quickFactsAxisTick} interval={0} />
            <YAxis />
            <RechartTooltip />
            <Legend layout="horizontal" verticalAlign="top" align="center" />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="Passing rate"
              fill="#8884d8"
              background={{ fill: "#eee" }}
              cx="50%"
            />
          </BarChart>
        </ResponsiveContainer>
        <Typography
          sx={{ fontWeight: 400, fontSize: 16, marginTop: 2 }}
          align="center"
        >
          Percentage of students who pass the courses
        </Typography>
      </Box>
    );

    setQuickFactsGraphs(graphs);
  };

  useEffect(() => {
    if (props.instructor) {
      get_instructors_by_id(props.instructor[0].member_id)
        .then((response) => {
          let sections = response.data.sections;
          let courses = getCourses(sections);
          delete response.data["sections"];
          representQuickFacts(courses);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }, [props.instructor]);

  const viewInstructorDetails = () => {
    navigate('../instructors/details', {
      state: {
        instructor: props.instructor[0],
      }
    });
  }


  return (
    <Card sx={{ width: 500, height: 430 }}>
      <CardHeader
        title={
          <Typography sx={{ fontSize: 26 }} align="left">
            {props.instructor[0].name}
          </Typography>
        }
        action={
          <MuiTooltip title="View in instructor page">
            <IconButton onClick={viewInstructorDetails}>
              <OpenInNewOutlinedIcon />
            </IconButton>
          </MuiTooltip>
        }
        subheader={
          <div>
              <Typography variant="body1">
                  <Box sx={{ fontWeight: 'bold' }} display="inline">Quick Facts</Box>
              </Typography>
          </div>
      }

        color="primary"
      />
      <CardContent>
        {!quickFactsGraphs ?
          <div className='infinite-loader'>
            <Loader.RotatingLines style={{ display: "inline-block" }} color="black" height={40} width={40} />
          </div> :
          <Grid
            item
            container
            justifyContent="center"
            sx={{ my: -4 }}
          >
            <Grid item container justifyContent="center" lg={12}>
            </Grid>
            <Grid item container lg={12}>
              <Carousel sx={{ width: "100%" }} interval={5000}>
                {quickFactsGraphs.map((GRAPH) => GRAPH)}
              </Carousel>
            </Grid>
          </Grid>}
      </CardContent>
    </Card>);
}
export default SectionInstructorInfo;
