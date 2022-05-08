import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { report_feedback } from "../../actions/feedback";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

let dropdown_style = { backgroundColor: "white", height: 35, width: 280, fontSize: 14 }
const REASONS = ["Innapropiate language", "Irrelevant content", "Posted by error", "Misinformation", "Spam", "Other"]

export default function ReportFeedbackModal(props) {

    const [reason, setReason] = useState(null);
    const [customReason, setCustomReason] = useState(null);

    const submit_report = () => {
        report_feedback(props.feedback.feedback_id, props.user_id, { "reason": reason == "Other" ? customReason : reason })
        .then(response => {
            props.feedback.reports.push(props.user_id);
            props.handleClose();
        }).catch((error) => {
            let message = error.response.data.error;
            props.handleClose();
        });
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.feedback}
                onClose={props.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.feedback}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Want to report the selected feedback?
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            Select the reason why this feedback seems innapropiate:
                        </Typography>
                        <FormControl>
                            <Select
                                style={dropdown_style}
                                value={reason}
                                displayEmpty
                                name="reason"
                                onChange={(e) => { setReason(e.target.value) }}
                                inputProps={{ 'aria-label': 'Without label' }}>
                                <MenuItem value={null}>
                                    <em>Select reason...</em>
                                </MenuItem>
                                {REASONS.map(reason => (
                                    <MenuItem value={reason}>
                                        {reason}
                                    </MenuItem>)
                                )}
                            </Select>
                        </FormControl>
                        {reason == "Other" && <div>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                Please tell us the reason why this feedback is innapropiate:
                            </Typography>
                            <TextField
                                id="filled-textarea"
                                multiline
                                variant="filled"
                                onChange={(e) => { setCustomReason(e.target.value) }}
                            />
                        </div>}

                        <div style={{ display: "flex", marginTop: 20 }}>
                            <Button onClick={submit_report} variant="contained" disabled={!reason || (reason == "Other" && !customReason)}>Report Feedback</Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}