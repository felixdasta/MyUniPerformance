import { React, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import * as Loader from 'react-loader-spinner'
import {
    PieChart, Pie, Text, Tooltip, XAxis, YAxis, Area, AreaChart, ResponsiveContainer, Cell
} from "recharts";
import "./StudentStatistics.scss"

function StudentStatistics(props) {
    let student = props.student;
    let totalCredits = 0
    let takenCredits = 0

    if(student.curriculums){
        for(let i = 0; i < student.curriculums.length; i++){
            {(student.curriculums[i].courses).map((courseData) =>(
                totalCredits += courseData.course.course_credits
            ))}
        }
    }
    if(student.enrolled_sections){
        {(student.enrolled_sections).map((courseData) => (
            takenCredits += courseData.section.course.course_credits
        ))}
    }

    let remainingCredits = totalCredits - takenCredits

    const COLORS = ["#FF8042", "#00C49F"]

    const data01 = [
        { name: 'Remaining Credits', value: remainingCredits},
        { name: 'Taken Credits', value: takenCredits}
    ];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    

    return (
        <div>
                <PieChart width={250} height={250}>
                    <Pie
                        data={data01}
                        cx="50%"
                        cy="50%"
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomizedLabel}
                    >
                        {data01.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
        </div>
    )



} export default (StudentStatistics);