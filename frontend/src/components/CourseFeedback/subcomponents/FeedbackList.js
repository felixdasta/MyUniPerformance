import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { like_feedback, unlike_feedback } from "../../../actions/feedback";
import { Avatar, Box } from '@mui/material';

function FeedbackList(props) {
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

    return (
        <div>
            {props.feedbacks &&
                (props.feedbacks).map((feedback, index) => (
                    <div style={{ display: 'flex' }}>
                        <div>d</div>
                        <Avatar style={props.avatar_style} src={props.department_logos[props.getStudentDepartmentId(feedback.student)]}></Avatar>
                        <div>
                            <Box bgcolor="white" className="feedbackContainer" sx={{ borderRadius: 10 }}>
                                <div class="feedbackTitle">Student from {props.getStudentDepartmentName(feedback.student)}</div>
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
                ))}
        </div>
    )
}

export default FeedbackList;