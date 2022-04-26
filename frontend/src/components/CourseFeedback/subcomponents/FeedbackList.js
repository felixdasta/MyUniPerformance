import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { like_feedback, unlike_feedback, delete_feedback } from "../../../actions/feedback";
import { Avatar, Box } from '@mui/material';
import { useState } from "react";
import * as Loader from "react-loader-spinner";

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function FeedbackList(props) {
    const [feedbackDeleteLoading, setFeedbackDeleteLoading] = useState();

    const addFeedbackLike = (feedback, index) => {
        feedback.likes.push(props.user_id);
        let feedbacks_copy = props.feedbacks.slice();
        feedbacks_copy[index] = feedback;
        props.setFeedbacks(feedbacks_copy);

        like_feedback(feedback.feedback_id, props.user_id);
    }

    const removeFeedbackLike = (feedback, index) => {
        for (let i = 0; i < feedback.likes.length; i++) {
            if (feedback.likes[i] === props.user_id) {
                feedback.likes.splice(i, 1);
                break;
            }
        }
        let feedbacks_copy = props.feedbacks.slice();
        feedbacks_copy[index] = feedback;
        props.setFeedbacks(feedbacks_copy);

        unlike_feedback(feedback.feedback_id, props.user_id);
    }

    const deleteFeedback = (feedback, index) => {
        setFeedbackDeleteLoading(index);
        delete_feedback(feedback.feedback_id).then(response => {
            setFeedbackDeleteLoading(null);
            props.deleteFeedback(feedback, index);
        }).catch((error) => {
            setFeedbackDeleteLoading(null);
        });
    }

    const getTagTheme = (backgroundColor) => {
        return { borderRadius: 10, padding: 1, backgroundColor: backgroundColor, marginLeft: 1, color: 'white' };
    }

    return (
        <div>
            {props.feedbacks &&
                (props.feedbacks).map((feedback, index) => {
                    if (feedbackDeleteLoading == index) {
                        return (
                        <div className='infinite-loader'>
                            <hr/>
                            <Loader.RotatingLines style={{ display: "inline-block" }} color="black" height={40} width={40} />
                        </div>)
                    }
                    else {
                        return (
                            <div>
                                <hr />
                                <div style={{ display: 'flex', margin: "25px 0px 25px 0px" }}>
                                    <Avatar style={props.avatar_style} src={props.department_logos[props.getStudentDepartmentId(feedback.student)]}></Avatar>
                                    <div>
                                        <div style={{ display: 'flex' }}>
                                            <Box bgcolor="white" sx={getTagTheme("Tomato")} className="feedbackTag">{"Term: " + feedback.section_term}</Box>
                                            <Box bgcolor="white" sx={getTagTheme("Orange")} className="feedbackTag">{"Section: " + feedback.section_code}</Box>
                                            <Box bgcolor="white" sx={getTagTheme("DodgerBlue")} className="feedbackTag">{"Instructor: " + feedback.instructor.name}</Box>
                                        </div>
                                        <Box
                                            bgcolor="white"
                                            id={feedback.feedback_id}
                                            className="feedbackContainer"
                                            sx={{ borderRadius: 10 }}>
                                            <div class="feedbackTitle">Student from {props.getStudentDepartmentName(feedback.student)}</div>
                                            <div class="feedbackDate">{"Date posted: " + new Date(feedback.timestamp).toLocaleDateString("en-US", dateOptions)}</div>
                                            <div>
                                                <div class="feedbackCommentType">Praises</div>
                                                <div>{feedback.praises}</div>
                                                <div class="feedbackCommentType">Criticism</div>
                                                <div>{feedback.criticism}</div>
                                            </div>
                                        </Box>
                                        <div style={{
                                            display: 'flex',
                                            marginTop: 5,
                                            marginLeft: 30
                                        }}>
                                            {(feedback.student.user_id == props.user_id) && <FaTrashAlt
                                                size={18}
                                                style={{ cursor: 'pointer', marginRight: 5 }}
                                                onClick={() => deleteFeedback(feedback, index)} />}
                                            {feedback.likes.includes(props.user_id)
                                                ? <AiFillLike
                                                    size={18}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => removeFeedbackLike(feedback, index)} /> :
                                                <AiOutlineLike
                                                    size={18}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => addFeedbackLike(feedback)} />}
                                            <div style={{ fontSize: 15 }}>{feedback.likes.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>);
                    }
                })}
        </div>
    )
}

export default FeedbackList;