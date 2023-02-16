import { useState } from "react";

import {
    Alert,
    AlertTitle,
    Button,
    Checkbox,
    Grid,
    Stack,
    Box,
    FormGroup,
    FormControlLabel,
} from "@mui/material";
import {
    EditOutlined as EditIcon,
    DeleteOutlined as DeleteIcon,
    ThumbUpOutlined as SubmitIcon,
    DoneOutlined as ApproveIcon,
} from "@mui/icons-material";

export default function EventActions({ actions = [] }) {
    // set palette view
    // base: base view (show all action buttons)
    // approval: approval view (show approval flow actions)
    // deletion: deletion view (show delete confirm box)
    const [view, setView] = useState("base");

    return {
        base: <BaseView actions={actions} setView={setView} />,
        approval: <ApprovalView setView={setView} />,
        deletion: <DeletionView setView={setView} />,
    }[view];
}

function BaseView({ actions, setView }) {
    const handleEdit = () => {
        // TODO: redirect to edit page
    };

    const handleDelete = () => {
        setView("deletion");
    };

    const handleSubmit = () => {
        // TODO: API call
    };

    const handleApprove = () => {
        setView("approval");
    };

    return (
        <Grid container spacing={2} p={2}>
            {actions.includes("edit") ? (
                <Grid item xs>
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="warning"
                        onClick={handleEdit}
                    >
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Edit
                    </Button>
                </Grid>
            ) : null}

            {actions.includes("delete") ? (
                <Grid item xs>
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                    </Button>
                </Grid>
            ) : null}

            {actions.includes("submit") ? (
                <Grid item xs>
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="info"
                        onClick={handleSubmit}
                    >
                        <SubmitIcon fontSize="small" sx={{ mr: 1 }} />
                        Submit
                    </Button>
                </Grid>
            ) : null}

            {actions.includes("approve") ? (
                <Grid item xs>
                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="success"
                        onClick={handleApprove}
                    >
                        <ApproveIcon fontSize="small" sx={{ mr: 1 }} />
                        Approve
                    </Button>
                </Grid>
            ) : null}
        </Grid>
    );
}

function ApprovalView({ setView }) {
    const [SLO, setSLO] = useState(false);
    const [SLC, setSLC] = useState(false);
    const [GAD, setGAD] = useState(false);

    const handleCancel = () => {
        setView("base");
    };

    const handleApprove = () => {
        console.log(SLO, SLC, GAD);
        // TODO: API call
        setView("base");
    };

    return (
        <Alert color="success" icon={false} sx={{ display: "block" }}>
            <AlertTitle> Approving Event </AlertTitle>

            <Grid container spacing={4}>
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={SLO}
                                onClick={(e) => setSLO(e.target.checked)}
                                color="success"
                            />
                        }
                        label="Request SLO approval"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={SLC}
                                onClick={(e) => setSLC(e.target.checked)}
                                color="success"
                            />
                        }
                        label="Request SLC approval"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={GAD}
                                onClick={(e) => setGAD(e.target.checked)}
                                color="success"
                            />
                        }
                        label="Request GAD approval"
                    />
                </Grid>
            </Grid>

            <Box mt={2} width="100%" display="flex" justifyContent="flex-end">
                <Button variant="contained" color="inherit" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="contained" color="success" sx={{ ml: 1 }} onClick={handleApprove}>
                    Confirm Approval
                </Button>
            </Box>
        </Alert>
    );
}

function DeletionView({ setView }) {
    const handleCancel = () => {
        setView("base");
    };

    const handleDelete = () => {
        // TODO: API call
        setView("base");
    };

    return (
        <Alert color="error" icon={false} sx={{ display: "block" }}>
            <AlertTitle> Confirm Deletion </AlertTitle>
            Are you sure you want to delete this event?
            <Box mt={2} width="100%" display="flex" justifyContent="flex-end">
                <Button variant="contained" color="inherit" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={handleDelete}>
                    Yes, delete it
                </Button>
            </Box>
        </Alert>
    );
}
