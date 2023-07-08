import { useRouter } from "next/router";

import { Alert, AlertTitle, Button, Box } from "@mui/material";
import { EditOutlined as EditIcon, DeleteOutlined as DeleteIcon } from "@mui/icons-material";

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

function DeletionView({ setView, deleteClub }) {
  const handleCancel = () => {
    setView("base");
  };

  const handleDelete = () => {
    deleteClub();
  };

  return (
    <Alert color="error" icon={false} sx={{ display: "block" }}>
      <AlertTitle> Confirm Deletion </AlertTitle>
      Are you sure you want to delete this club?
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
