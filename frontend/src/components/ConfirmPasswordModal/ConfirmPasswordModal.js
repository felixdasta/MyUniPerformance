import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { useState } from 'react';

export default function PasswordDeleteConfirmationModal(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [error, setError] = useSate();

    return (
        <Dialog
            fullScreen={fullScreen}
            open={props.feedback}
            onClose={props.handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {"Please confirm your identity to change password..."}
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity='error'> </Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.action} autoFocus>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}
