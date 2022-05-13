import { React, useState, useEffect } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import {
  get_sections_grades_stats,
  calculate_gpa_based_on_counts
} from '../../actions/sections';
import {
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  BarChart,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";
import "./StudentStatistics.scss";

function StudentStatistics(props) {
  const [filteredClasses, setFilteredClasses] = useState([]);

  let student = props.student;
  let totalCredits = 0;
  let takenCredits = 0;
  let gpaCredits = 0;
  let totalSemesters = 0;
  let honorPoints = 0;
  let gpa = 0.0;
  let aCount = 0;
  let bCount = 0;
  let cCount = 0;
  let dCount = 0;
  let fCount = 0;
  let pCount = 0;
  let wCount = 0;
  let result = 0;

  useEffect(() => {
    let payload = student.enrolled_sections.filter(
      (payload) => payload.grade_obtained !== "IP"
    );
    setFilteredClasses(payload)
  }, []);

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
    let GPA = [];
    student.enrolled_sections.map((payload, i) => {
      let grades_count = get_sections_grades_stats([payload.section])
      GPA.push(calculate_gpa_based_on_counts(grades_count))
    })
    for(let i = 0; i < GPA.length; i++){
      result += parseFloat(GPA[i])
    }
    result = result / GPA.length
    result = result.toFixed(2)
    {
      let student_dept_id = student.curriculums[0].department.department_id;
      student.enrolled_sections.map((courseData) => {
        let course_dept_id = courseData.section.course.department.department_id;
        let grade = courseData.grade_obtained;
        if (student_dept_id === course_dept_id
          && (grade !== "F" && grade !== "D" && grade !== "W")) {
          takenCredits += courseData.section.course.course_credits;
        }
        else if (student_dept_id !== course_dept_id
          && (grade !== "F" && grade !== "W")) {
          takenCredits += courseData.section.course.course_credits;
        }

        switch (courseData.grade_obtained) {
          case "A":
            aCount += 1;
            honorPoints =
              honorPoints + 4 * courseData.section.course.course_credits;
            gpaCredits += courseData.section.course.course_credits;
            break;
          case "B":
            bCount += 1;
            honorPoints =
              honorPoints + 3 * courseData.section.course.course_credits;
            gpaCredits += courseData.section.course.course_credits;
            break;
          case "C":
            cCount += 1;
            honorPoints =
              honorPoints + 2 * courseData.section.course.course_credits;
            gpaCredits += courseData.section.course.course_credits;
            break;
          case "D":
            dCount += 1;
            honorPoints =
              honorPoints + 1 * courseData.section.course.course_credits;
            gpaCredits += courseData.section.course.course_credits;
            break;
          case "F":
            fCount += 1;
            honorPoints =
              honorPoints + 0 * courseData.section.course.course_credits;
            gpaCredits += courseData.section.course.course_credits;
            break;
          case "W":
            wCount += 1;
            break;
          case "P":
            pCount += 1;
            break;
          default:
            break;
        }
        gpa = honorPoints / gpaCredits;
        gpa = gpa.toFixed(2);
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
    { name: "Approved Credits", value: takenCredits },
  ];

  const data02 = [
    { name: "A", grade: aCount },
    { name: "B", grade: bCount },
    { name: "C", grade: cCount },
    { name: "D", grade: dCount },
    { name: "F", grade: fCount },
    { name: "P", grade: pCount },
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
    <Container component={Paper} sx={{ backgroundColor: "white", height: 750 }}>
      <Typography sx={{ fontSize: 28 }} align="center">
        Student Statistics
      </Typography>
      <Box height={550} alignContent="center">
        <Carousel interval={5000}>
          {GRAPHS.map((GRAPH, index) => {
            return (<Box>
              {GRAPH}
              {TITLES[index]}
            </Box>);
          })}
        </Carousel>
        <Typography align="center" sx={{ my: 3.5}}>
          You have approximately {remainingSemester} semesters left if you
          progress at a rate of {creditProgress} credits per semester.
        </Typography>
        {student.enrolled_sections.length > 0 && <Typography align="center" sx={{ my: 3.5}}>
          Your current GPA is:<br/>
          <div style={{fontWeight: 'bold', fontSize: 18}}>{gpa}</div>
        </Typography>}
        {student.enrolled_sections.length > 0 && <Typography align="center" sx={{ my: 3.5}}>
          Students who took the same sections as you have an average GPA of:<br/>
          <div style={{fontWeight: 'bold', fontSize: 18}}>{result}</div>
        </Typography>}
      </Box>
    </Container>
  );
}
export default StudentStatistics;