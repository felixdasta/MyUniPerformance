import { Box, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from "react";
import { department_logos } from '../../config.js';
import { VscTriangleDown } from 'react-icons/vsc';
import NewFeedback from "./subcomponents/NewFeedback";
import FeedbackList from "./subcomponents/FeedbackList";
import './CourseFeedback.scss';

const filterTypes = {
    1: "Most recent",
    2: "Most relevant"
}

function CourseFeedback(props) {
    let user_id = localStorage.getItem("user_id");

    const [feedbacks, setFeedbacks] = useState([]);
    const [filterType, setFilterType] = useState(filterTypes[1]);
    const [anchorEl, setAnchorEl] = useState(null);

    const getStudentDepartmentName = (student) => student.curriculums[0].department.department_name + " Department";
    const getStudentDepartmentId = (student) => student.curriculums[0].department.department_id;

    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const filterFeedbacks = (sortType, feedbacks) => {
        setFilterType(filterTypes[sortType]);
        if (sortType == 1) {
            feedbacks.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        }
        if (sortType == 2) {
            feedbacks.sort((a, b) => b.likes.length - a.likes.length);
        }
        setFeedbacks(feedbacks);
        handleClose();
    }

    const populateFeedbacks = (sections) => {
        let feedbacks = [];
        for (let section of sections) {
            let section_feedbacks = []
            for(let feedback of section.feedbacks){
                let merged_value = {...feedback, ...section}
                merged_value['likes'] = feedback.likes;
                delete merged_value.feedbacks
                section_feedbacks.push(merged_value);
            }
            feedbacks = feedbacks.concat(section_feedbacks);
        }
        return feedbacks;
    }

    useEffect(() => {
        if (props.sections) {
            let feedbacks = populateFeedbacks(props.sections);
            filterFeedbacks(1, feedbacks);
            setFeedbacks(feedbacks);
        }
    }, [props.sections]);

    let sx = {
        width: "50%",
        margin: "auto",
        padding: 3,
        alignItems: "center",
        fontSize: 14
    };

    let avatar_style = {
        backgroundColor: '#F6F6F6',
        margin: "55px 10px 0px 0px",
        width: 75,
        height: 75,
    }

    return (
        <Box bgcolor="#e5e5e5" sx={sx}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>Feedbacks</div>
                <div class="feedbackFilterButton" onClick={handleClick}>
                    <div style={{ marginRight: 2.5 }}>{filterType}</div>
                    <VscTriangleDown style={{ marginTop: 2 }} />
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={() => filterFeedbacks(1, feedbacks.slice())}>{filterTypes[1]}</MenuItem>
                    <MenuItem onClick={() => filterFeedbacks(2, feedbacks.slice())}>{filterTypes[2]}</MenuItem>
                </Menu>
            </div>

            {props.section != "All" && props.instructor != "All" &&
                <div>
                    <hr />
                    <NewFeedback
                        section_id={props.section.section_id}
                        instructor_id={props.instructor.member_id}
                        user_id={user_id}
                        department_logos={department_logos}
                        avatar_style={avatar_style}
                        getStudentDepartmentId={getStudentDepartmentId}
                        pushNewFeedback={ (feedback) => {
                            props.section.feedbacks.push(feedback);
                            let merged_value = {...feedback, ...props.section};
                            delete merged_value.feedbacks;
                            let feedbacks_copy = feedbacks.slice();
                            feedbacks_copy.unshift(merged_value);
                            setFeedbacks(feedbacks_copy);
                        } }
                        />
                </div>
            }
            {feedbacks && feedbacks.length > 0 ?<FeedbackList
                user_id={user_id}
                department_logos={department_logos}
                avatar_style={avatar_style}
                getStudentDepartmentId={getStudentDepartmentId}
                getStudentDepartmentName={getStudentDepartmentName}
                feedbacks={feedbacks}
                setFeedbacks={setFeedbacks}
                section = {props.section}
                instructor = {props.instructor}
                deleteFeedback ={ (feedback, index) => {
                    let feedbacks_copy = feedbacks.slice();
                    feedbacks_copy.splice(index, 1);       

                    for(let section of props.sections){
                        for(let i = 0; i < section.feedbacks.length; i++){
                            let other_feedback = section.feedbacks[i];
                            if(other_feedback.feedback_id == feedback.feedback_id){
                                section.feedbacks.splice(i, 1);       
                                break;
                            }
                        }
                    }

                    setFeedbacks(feedbacks_copy);
                } }
            /> : <div style={{textAlign: 'center'}}>No feedbacks available.</div>}
        </Box>)
}

export default CourseFeedback;