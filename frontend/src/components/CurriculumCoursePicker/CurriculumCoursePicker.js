import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import InfiniteScroll from 'react-infinite-scroller';
import * as Loader from "react-loader-spinner";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Divider, IconButton, List } from "@mui/material";

export default function CurriculumCoursePicker(props) {
    let [coursesCurriculum, setCoursesCurriculum] = useState([]);
    let [coursesTaken, setCoursesTaken] = useState();
    let [filters, setFilters] = useState();

    useEffect(() => {
        setCoursesCurriculum(props.student.curriculums[0].courses)

    }, [])

    if (coursesCurriculum !== undefined) {
        return (
            /*             <Box
                            sx={{ width: '100%', height: 700, maxWidth: 360, bgcolor: 'background.paper' }}
                        >
                            <FixedSizeList
                                height={700}
                                width={360}
                                itemSize={46}
                                itemCount={coursesCurriculum.length}
                            >
                                {coursesCurriculum.map((course) => (
                                    <ListItem
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="submit">
                                                <DoubleArrowIcon />
                                            </IconButton>
                                        }
                                        key={course.course.course_id}
                                    >
                                        <ListItemText
                                            primary={course.course.course_code}
                                            secondary={course.course.course_name}
                                        />
                                    </ListItem>))}
                            </FixedSizeList>
                        </Box> */
            <Box boxShadow={1} sx={{ border: '1px' }}>
                <List sx={{ width: '100%', height: 700, maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto' }}>
                    <InfiniteScroll>
                        {coursesCurriculum.map((course) => (
                            <div>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="submit">
                                            <DoubleArrowIcon />
                                        </IconButton>
                                    }
                                    key={course.course.course_id}
                                >
                                    <ListItemText
                                        primary={course.course.course_code}
                                        secondary={course.course.course_name}
                                    />
                                </ListItem>
                                <Divider variant="middle" />
                            </div>))}
                    </InfiniteScroll>
                </List>
            </Box >

        );
    }
}