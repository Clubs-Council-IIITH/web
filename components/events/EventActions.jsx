import { useState } from "react";

import { useRouter } from "next/router";

import { useAuth } from "contexts/AuthContext";

import { useMutation } from "@apollo/client";
import { PROGRESS_EVENT, DELETE_EVENT } from "gql/mutations/events";
import { GET_FULL_EVENT } from "gql/queries/events";

import { Alert, AlertTitle, Button, Checkbox, Grid, Box, FormControlLabel } from "@mui/material";

import Iconify from "components/iconify";

// edit
export const editAction = {
  name: "edit",
  button: EditButton,
  view: null,
};

function EditButton({ setView }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`${router.asPath}/edit`);
  };

  return (
    <Button
      variant="contained"
      color="warning"
      onClick={handleEdit}
      startIcon={<Iconify icon="mdi:pencil" />}
    >
      Edit
    </Button>
  );
}

// submit
export const submitAction = {
  name: "submit",
  button: SubmitButton,
  view: null,
};

function SubmitButton({ setView }) {
  const { query } = useRouter();
  const { id: eid } = query;
  const [progressEvent, { data, error, loading }] = useMutation(PROGRESS_EVENT);

  const handleSubmit = () => {
    progressEvent({
      variables: { eventid: eid },
      refetchQueries: [{ query: GET_FULL_EVENT, variables: { eventid: eid } }],
    });
  };

  return (
    <Button
      variant="contained"
      color="info"
      onClick={handleSubmit}
      startIcon={<Iconify icon="mdi:thumb-up" />}
    >
      Submit
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
    <Button
      variant="contained"
      color="error"
      onClick={handleDelete}
      startIcon={<Iconify icon="mdi:delete" />}
    >
      Delete
    </Button>
  );
}

function DeletionView({ setView }) {
  const handleCancel = () => {
    setView("base");
  };

  const { query } = useRouter();
  const { id: eid } = query;
  const [deleteEvent, { data, error, loading }] = useMutation(DELETE_EVENT);

  const handleDelete = () => {
    deleteEvent({
      variables: { eventid: eid },
      refetchQueries: [{ query: GET_FULL_EVENT, variables: { eventid: eid } }],
    });
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

// approve
export const approveAction = {
  name: "approve",
  button: ApproveButton,
  view: ApprovalView,
};

function ApproveButton({ setView }) {
  const handleApprove = () => {
    setView("approve");
  };

  return (
    <Button
      variant="contained"
      color="success"
      onClick={handleApprove}
      startIcon={<Iconify icon="mdi:check" />}
    >
      Approve
    </Button>
  );
}

function ApprovalView({ setView }) {
  const [SLO, setSLO] = useState(false);
  const [SLC, setSLC] = useState(false);

  const { user } = useAuth();

  const { query } = useRouter();
  const { id: eid } = query;
  const [progressEvent, { data, error, loading }] = useMutation(PROGRESS_EVENT);

  const handleCancel = () => {
    setView("base");
  };

  const handleApprove = () => {
    progressEvent({
      variables: {
        eventid: eid,
        ...(user.role === "cc" && { cc_progress_budget: !SLC, cc_progress_room: !SLO }),
      },
      refetchQueries: [{ query: GET_FULL_EVENT, variables: { eventid: eid } }],
    });
    setView("base");
  };

  return (
    <Alert color="success" icon={false} sx={{ display: "block" }}>
      <AlertTitle> Approving Event </AlertTitle>

      {user.role === "cc" ? (
        <Grid container spacing={1}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox checked={SLC} onClick={(e) => setSLC(e.target.checked)} color="success" />
              }
              label="Request SLC approval (for budget, if requested)"
            />
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Checkbox checked={SLO} onClick={(e) => setSLO(e.target.checked)} color="success" />
              }
              label="Request SLO approval (for venue, if requested)"
            />
          </Grid>
        </Grid>
      ) : (
        <Box> Are you sure you want to approve this event? This can not be undone. </Box>
      )}

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
