import { React, useState, useEffect } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import * as Loader from "react-loader-spinner";
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
  let aCount = 0;
  let bCount = 0;
  let cCount = 0;
  let dCount = 0;
  let fCount = 0;
  let wCount = 0;

  if (student.curriculums) {
    for (let i = 0; i < student.curriculums.length; i++) {
      {
        student.curriculums[i].courses.map(
          (courseData) => (totalCredits += courseData.course.course_credits)
        );
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
            break;
          case "B":
            bCount += 1;
            break;
          case "C":
            cCount += 1;
            break;
          case "D":
            dCount += 1;
            break;
          case "F":
            fCount += 1;
            break;
          case "W":
            wCount += 1;
            break;
          default:
            break;
        }
      });
    }
  }

  let remainingCredits = totalCredits - takenCredits;

  const COLORS = ["#FF8042", "#00C49F"];

  const data01 = [
    { name: "Remaining Credits", value: remainingCredits },
    { name: "Taken Credits", value: takenCredits },
  ];

  const data02 = [
    { name: "A", value: aCount },
    { name: "B", value: bCount },
    { name: "C", value: cCount },
    { name: "D", value: dCount },
    { name: "F", value: fCount },
    { name: "W", value: wCount },
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

  return (
    <Container component={Paper} sx={{ backgroundColor: "white" }}>
      <Typography sx={{ fontSize: 28 }} align="center">
        {" "}
        Student Statistics{" "}
      </Typography>
      <Box height={700}>
        <PieChart width={300} height={250}>
          <Pie
            data={data01}
            cx="50%"
            cy="50%"
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
        <Typography align="center" sx={{ my: 0.5 }}>
        </Typography>
        <Typography sx={{ fontSize: 28, my: 5 }} align="center">
        </Typography>
        <BarChart width={300} height={250} data={data02}>
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 10, right: 10 }}
            cx="50%"
            cy="50%"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
        </BarChart>
      </Box>
    </Container>
  );
}
export default StudentStatistics;
