import * as Loader from "react-loader-spinner";
import { get_student_by_id } from '../../../actions/user.js';
import { Avatar, Box, Button, Alert } from '@mui/material';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { create_feedback } from "../../../actions/feedback"

function NewFeedback(props) {
    const [newFeedback, setNewFeedback] = useState({
        praises: "",
        criticism: ""
    });
    const [postingComment, setPostingComment] = useState();
    const [openNewFeedbackActions, setOpenNewFeedbackActions] = useState();
    const [student, setStudent] = useState();
    const [error, setError] = useState();
    let navigate = useNavigate();

    const inputChange = (e) => {
        setNewFeedback({ ...newFeedback, [e.target.name]: e.target.value });
    };

    const clearCommentBox = () => {
        setNewFeedback({ ...newFeedback, ['criticism']: "", ['praises']: "" });
        setOpenNewFeedbackActions(false);
    }

    const postComment = () => {
        setPostingComment(true);
        let feedback = {
            student_id: props.user_id,
            section_id: props.section_id,
            instructor_id: props.instructor_id,
            ...newFeedback
        }
        setError(null);
        create_feedback(props.section_id, feedback).then(response => {
            props.pushNewFeedback(response.data);
            setPostingComment(false);
        }).catch((error) => {
            let message = error.response.data.error;
            setError(message);
            setPostingComment(false);
        });

        clearCommentBox();
        setOpenNewFeedbackActions(false);

    }

    useEffect(() => {
        get_student_by_id(props.user_id).then(
            response => {
                setStudent(response.data);
            }
        ).catch((error) => {
            console.log(error)
            localStorage.removeItem("user_id");
            navigate("/");
        })
    }, [props.user_id]);

    return (
        <div>
            {error && <Alert severity="error">{error}</Alert>}

            {student && !postingComment ?
                <div>
                    <div style={{ display: 'flex' }}>
                        <Avatar style={{ ...props.avatar_style, margin: "20px 10px 0px 0px" }} src={props.department_logos[props.getStudentDepartmentId(student)]}></Avatar>
                        <div>
                            <Box bgcolor="white" className="feedbackContainer" sx={{ borderRadius: 10 }}>
                                <div>
                                    <div>Praises</div>
                                    <hr />
                                    <textarea
                                        value={newFeedback.praises}
                                        name="praises"
                                        onClick={() => setOpenNewFeedbackActions(true)}
                                        cols="1000"
                                        rows="5"
                                        className="feedbackTextbox"
                                        onChange={inputChange}
                                        placeholder="Write your section praises..." />
                                    <div>Criticism</div>
                                    <hr />
                                    <textarea
                                        value={newFeedback.criticism}
                                        name="criticism"
                                        onClick={() => setOpenNewFeedbackActions(true)}
                                        cols="1000"
                                        rows="5"
                                        className="feedbackTextbox"
                                        onChange={inputChange}
                                        placeholder="Write your section criticisms..." />
                                </div>
                            </Box>
                            {openNewFeedbackActions &&
                                <div style={{ display: 'flex' }}>
                                    <Button disabled={!newFeedback.praises || !newFeedback.criticism} sx={{ marginTop: 1 }} onClick={postComment} align='center' variant="contained">Post</Button>
                                    <Button sx={{ marginTop: 1, marginLeft: 1 }} onClick={clearCommentBox} align='center' variant="contained">Cancel</Button>
                                </div>}
                        </div>
                    </div>
                </div>
                :
                <div className='infinite-loader'>
                    <Loader.RotatingLines style={{ display: "inline-block" }} color="black" height={40} width={40} />
                </div>
            }
        </div>
    )
}

export default NewFeedback;