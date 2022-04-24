import { Avatar, Box } from '@mui/material';
import { React, useEffect, useState } from "react";
import { department_logos } from '../../config.js';
import { VscTriangleDown } from 'react-icons/vsc';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { like_feedback, unlike_feedback } from "../../actions/feedback";
import './CourseFeedback.scss';

function CourseFeedback(props) {
    let user_id = localStorage.getItem("user_id");

    const [feedbacks, setFeedbacks] = useState();
    const getStudentDepartmentName = (student) => student.curriculums[0].department.department_name + " Department";
    const getStudentDepartmentId = (student) => student.curriculums[0].department.department_id;

    const addFeedbackLike = (feedback, index) => {
        feedback.likes.push(user_id);
        let feedbacks_copy = feedbacks.slice();
        feedbacks_copy[index] = feedback;
        setFeedbacks(feedbacks_copy);

        like_feedback(feedback.feedback_id,user_id);
    }

    const removeFeedbackLike = (feedback, index) => {
        for(let i = 0; i < feedback.likes.length; i++){ 
            if (feedback.likes[i] === user_id) { 
                feedback.likes.splice(i, 1); 
                break;
            }
        }
        let feedbacks_copy = feedbacks.slice();
        feedbacks_copy[index] = feedback;
        setFeedbacks(feedbacks_copy);

        unlike_feedback(feedback.feedback_id,user_id);
    }

    const populateFeedbacks = (sections) => {
        let feedbacks = [];
        for (let section of sections) {
            feedbacks = feedbacks.concat(section.feedbacks);
        }
        return feedbacks;
    }

    useEffect(() => {
        if (props.sections) {
            setFeedbacks(populateFeedbacks(props.sections));
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
        margin: "15px 10px 0px 0px",
        width: 75,
        height: 75,
    }

    return (
        <Box bgcolor="#e5e5e5" sx={sx}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>Feedbacks</div>
                <div class="feedbackFilterButton">
                    <div style={{ marginRight: 2.5 }}>Most recent</div>
                    <VscTriangleDown style={{ marginTop: 2 }} />
                </div>
            </div>

            {feedbacks &&
                (feedbacks).map((feedback, index) => (
                    <div style={{ display: 'flex' }}>
                        <Avatar style={avatar_style} src={department_logos[getStudentDepartmentId(feedback.student)]}></Avatar>
                        <div>
                            <Box bgcolor="white" className="feedbackContainer" sx={{ borderRadius: 10 }}>
                                <div>
                                    <div class="feedbackTitle">Student from {getStudentDepartmentName(feedback.student)}</div>
                                    <div>
                                        <div class="feedbackCommentType">Praises</div>
                                        <div>{feedback.praises}</div>
                                        <div class="feedbackCommentType">Criticism</div>
                                        <div>{feedback.criticism}</div>
                                    </div>
                                </div>
                            </Box>
                            <div style={{
                                display: 'flex',
                                marginTop: 5,
                                marginLeft: 30
                            }}>
                                {feedback.likes.includes(user_id)
                                    ? <AiFillLike
                                        size={18}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => removeFeedbackLike(feedback, index)}/> :
                                    <AiOutlineLike
                                        size={18}
                                        style={{ cursor: 'pointer' }} 
                                        onClick={ () => addFeedbackLike(feedback)}/>}
                                <div style={{ fontSize: 15 }}>{feedback.likes.length}</div>
                            </div>
                        </div>

                    </div>
                ))}

        </Box>)
}

export default CourseFeedback;