import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { like_feedback, unlike_feedback, delete_feedback } from "../../../actions/feedback";
import { Avatar, Box, Grid, Alert, Snackbar } from '@mui/material';
import { useState } from "react";
import * as Loader from "react-loader-spinner";
import ReportFeedbackModal from '../../ReportFeedbackModal/ReportFeedbackModal';
import FeedbackDeleteConfirmationModal from '../../ConfirmFeedbackDeleteModal/ConfirmFeedbackDeleteModal';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

function FeedbackList(props) {
    const [feedbackToReport, setFeedbackToReport] = useState();
    const [reportedFeedbackMessage, setReportedFeedbackMessage] = useState();
    const [feedbackToDelete, setFeedbackToDelete] = useState();
    
    const openConfirmFeedbackDeleteModal = (feedback) => setFeedbackToDelete(feedback);
    const closeConfirmFeedbackDeleteModal = () => {setFeedbackToDelete(null); }

    const openReportFeedbackModal = (feedback) => setFeedbackToReport(feedback);
    const closeReportFeedbackModal = () => {setFeedbackToReport(null); setReportedFeedbackMessage(true); }

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
        return { borderRadius: 7.5, padding: 1, backgroundColor: backgroundColor, marginLeft: 1, color: 'white' };
    }

    return (
        <div>
            <FeedbackDeleteConfirmationModal feedback={feedbackToDelete} action={deleteFeedback} handleClose={closeConfirmFeedbackDeleteModal} />
            <ReportFeedbackModal feedback={feedbackToReport} user_id={props.user_id} handleClose={closeReportFeedbackModal} />
            {props.feedbacks &&
                (props.feedbacks).map((feedback, index) => {
                    if (feedbackDeleteLoading == index) {
                        return (
                            <div className='infinite-loader'>
                                <hr />
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
                                            <Box bgcolor="white" sx={getTagTheme("Tomato")}>{"Term: " + feedback.section_term}</Box>
                                            <Box bgcolor="white" sx={getTagTheme("Orange")}>{"Section: " + feedback.section_code}</Box>
                                            {feedback.course ?
                                                <Box bgcolor="white" sx={getTagTheme("DodgerBlue")}>{"Course: " + feedback.course.course_code}</Box>
                                                : <Box bgcolor="white" sx={getTagTheme("DodgerBlue")}>{"Instructor: " + feedback.instructor.name}</Box>
                                            }
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
                                            <Grid container spacing={0}>
                                                <Grid container item xs={4}>
                                                    {(feedback.student.user_id == props.user_id) && <FaTrashAlt
                                                        size={18}
                                                        style={{ cursor: 'pointer', marginRight: 5 }}
                                                        onClick={() => openConfirmFeedbackDeleteModal({'feedback': feedback, 'index': index}) } />}
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
                                                </Grid>
                                                <Grid container item xs={8} justifyContent="flex-end">
                                                    {feedback.reports.includes(props.user_id) ?
                                                        <div style={{ marginRight: 25 }}>
                                                            You have already reported this feedback
                                                        </div> :
                                                        <div  onClick={() => {openReportFeedbackModal(feedback)}} style={{ cursor: 'pointer', marginRight: 25, fontWeight: 425 }}>
                                                            Report
                                                        </div>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </div>
                                </div>
                            </div>);
                    }
                })}
                                <Snackbar open={reportedFeedbackMessage} autoHideDuration={6000} onClose={() => setReportedFeedbackMessage(false)}>
                    <Alert onClose={() => setReportedFeedbackMessage(false)} severity="success" sx={{ width: '100%' }}>
                        Thank you for reporting the feedback! Our team will be reviewing it.
                    </Alert>
                </Snackbar>
        </div>
    )
}

export default FeedbackList;