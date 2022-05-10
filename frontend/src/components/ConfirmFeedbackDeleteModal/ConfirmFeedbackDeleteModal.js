import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function FeedbackDeleteConfirmationModal(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={props.feedback}
            onClose={props.handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {"Are you sure you want to delete this feedback?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You cannot revert this action.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.action(props.feedback["feedback"], props.feedback["index"]); 
                    props.handleClose()
                }} autoFocus>
                    Yes
                </Button>
                <Button autoFocus onClick={props.handleClose}>
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );
}
