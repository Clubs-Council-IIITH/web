import { useState } from "react";
import { useRouter } from "next/router";

import { Alert, AlertTitle, Button, Checkbox, Grid, Box, FormControlLabel } from "@mui/material";
import {
    EditOutlined as EditIcon,
    DeleteOutlined as DeleteIcon,
    ThumbUpOutlined as SubmitIcon,
    DoneOutlined as ApproveIcon,
} from "@mui/icons-material";

// edit
export const editAction = {
    name: "edit",
    button: EditButton,
    view: null,
};

function EditButton({ setView }) {
    const router = useRouter();

    const handleEdit = () => {
        // TODO: redirect to edit page
        // router.push(`${router.asPath}/edit`);
    };

    return (
        <Button fullWidth size="large" variant="outlined" color="warning" onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
        </Button>
    );
}

// delete
export const deleteAction = {
    name: "delete",
    button: DeleteButton,
    view: DeletionView,
};

function DeleteButton({ setView }) {
    const handleDelete = () => {
        setView("delete");
    };

    return (
        <Button fullWidth size="large" variant="outlined" color="error" onClick={handleDelete}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
        </Button>
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
            Are you sure you want to delete this user&apos;s membership?{" "}
            <b>All of their positions in the club, ever, will be revoked!</b>
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
