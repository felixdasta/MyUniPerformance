import { React, useState, useEffect } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useLocation } from "react-router-dom";
import * as Loader from "react-loader-spinner";
import { fontWeight } from "@mui/system";
import {
  PieChart,
  Pie,
  Text,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ResponsiveContainer,
  Cell,
  BarChart,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";
import "./StudentStatistics.scss";

function StudentStatistics(props) {
  let student = props.student;
  let totalCredits = 0;
  let takenCredits = 0;
  let totalSemesters = 0;
  let honorPoints = 0;
  let gpa = 0.0;
  let aCount = 0;
  let bCount = 0;
  let cCount = 0;
  let dCount = 0;
  let fCount = 0;
  let wCount = 0;

  if (student.curriculums) {
    for (let i = 0; i < student.curriculums.length; i++) {
      {
        student.curriculums[i].courses.map((courseData) => {
          totalCredits += courseData.course.course_credits;
          if (courseData.semester) {
            if (totalSemesters < courseData.semester) {
              totalSemesters = courseData.semester;
            }
          }
        });
      }
    }
  }
  if (student.enrolled_sections) {
    {
      student.enrolled_sections.map((courseData) => {
        takenCredits += courseData.section.course.course_credits;
        switch (courseData.grade_obtained) {
          case "A":
            aCount += 1;
            honorPoints =
              honorPoints + 4 * courseData.section.course.course_credits;
            break;
          case "B":
            bCount += 1;
            honorPoints =
              honorPoints + 3 * courseData.section.course.course_credits;
            break;
          case "C":
            cCount += 1;
            honorPoints =
              honorPoints + 2 * courseData.section.course.course_credits;
            break;
          case "D":
            dCount += 1;
            honorPoints =
              honorPoints + 1 * courseData.section.course.course_credits;
            break;
          case "F":
            fCount += 1;
            honorPoints =
              honorPoints + 0 * courseData.section.course.course_credits;
            break;
          case "W":
            wCount += 1;
            break;
          default:
            break;
        }
        gpa = honorPoints / takenCredits;
        gpa = gpa.toPrecision(2);
      });
    }
  }

  let remainingCredits = totalCredits - takenCredits;
  let creditProgress = Math.ceil(totalCredits / totalSemesters);
  let remainingSemester = Math.ceil(remainingCredits / creditProgress);

  const COLORS = ["#FF8042", "#00C49F"];
  const GRAPHS = [];
  const TITLES = [];

  const data01 = [
    { name: "Remaining Credits", value: remainingCredits },
    { name: "Taken Credits", value: takenCredits },
  ];

  const data02 = [
    { name: "A", grade: aCount },
    { name: "B", grade: bCount },
    { name: "C", grade: cCount },
    { name: "D", grade: dCount },
    { name: "F", grade: fCount },
    { name: "W", grade: wCount },
  ];

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  GRAPHS.push(
    <ResponsiveContainer width="100%" height={250}>
      <PieChart
        width={250}
        height={250}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <Pie
          data={data01}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={false}
          label={renderCustomizedLabel}
        >
          {data01.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]}></Cell>
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  TITLES.push(
      <Typography align="center" sx={{ my: 0.75, fontWeight: 500 }}>
      Degree Completion Breakdown
      </Typography>
  )
  

  GRAPHS.push(
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        width={250}
        height={250}
        data={data02}
        margin={{
          top: 20,
          right: 45,
          left: 0,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" scale="point" padding={{ left: 20, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar
          dataKey="grade"
          fill="#8884d8"
          background={{ fill: "#eee" }}
          cx="50%"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  TITLES.push(
    <Typography align="center" sx={{ my: 0.75, fontWeight: 500 }}>
    Grade Distribution
    </Typography>
  )

  return (
    <Container component={Paper} sx={{ backgroundColor: "white" }}>
      <Typography sx={{ fontSize: 28 }} align="center">
        Student Statistics
      </Typography>
      <Box height={475} alignContent="center">
        <Carousel>
          {GRAPHS.map((GRAPH, index) => {
            return (<Box>
                {GRAPH}
                {TITLES[index]}
                </Box>);
          })}
        </Carousel>
        <Typography align="center" sx={{ my: 3.5 }}>
          You have approximately {remainingSemester} semesters left if you
          progress at a rate of {creditProgress} credits per semester.
        </Typography>
        <Typography align="center" sx={{ my: 3.5 }}>
          Your current GPA is: {gpa}
        </Typography>
      </Box>
    </Container>
  );
}
export default StudentStatistics;
