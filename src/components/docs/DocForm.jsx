"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import FileUpload from "components/FileUpload";
import Icon from "components/Icon";
import { useToast } from "components/Toast";

import { uploadPDFFile } from "utils/files";

import { createStorageFile } from "actions/storagefiles/create/server_action";
import { updateStorageFile } from "actions/storagefiles/update/server_action";
import { deleteStorageFile } from "actions/storagefiles/delete/server_action";

const maxFileSizeMB = 20;

export default function DocForm({ editFile = null, newFile = true }) {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: editFile?.title || "",
      file: null,
    },
  });
  const { triggerToast } = useToast();
  const router = useRouter();

  const openDeleteDialog = () => setDeleteDialogOpen(true);
  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  async function handleDeleteConfirm() {
    try {
      if (!editFile) {
        throw new Error("File not found to delete");
      }
      const res = await deleteStorageFile(editFile._id);
      if (!res.ok) {
        throw res.error;
      }
      triggerToast({
        title: "Success!",
        messages: ["Document deleted."],
        severity: "success",
      });
      router.push(`/docs`);
    } catch (error) {
      triggerToast({
        title: "Error",
        messages: error.message
          ? [error.message]
          : error?.messages || ["Failed to delete document"],
        severity: "error",
      });
    } finally {
      closeDeleteDialog();
    }
  }

  async function onSubmit(data) {
    setLoading(true);

    try {
      // check all fields
      if (!data.title || !data.file) {
        throw new Error(
          "Please fill all the required Fields before submitting."
        );
      }

      const filename = await uploadPDFFile(
        data.file[0],
        true,
        data.title,
        maxFileSizeMB
      );
      if (!filename) {
        throw new Error("File upload failed, check Title and File validity");
      }

      if (newFile) {
        // create doc
        const res = await createStorageFile({
          title: data.title,
          filename: filename,
          filetype: "pdf",
        });
        if (!res.ok) {
          throw res.error;
        }
      } else {
        // update existing doc
        const res = await updateStorageFile(editFile._id);
        if (!res.ok) {
          throw new Error("Updating file to database failed!");
        }
      }

      triggerToast({
        title: "Success!",
        messages: ["Document saved."],
        severity: "success",
      });
      router.push(`/docs`);
    } catch (error) {
      triggerToast({
        title: "Error",
        messages: error?.message
          ? [error.message]
          : error?.messages || ["Failed to save document"],
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h5" sx={{ p: 2 }}>
          Upload File
        </Typography>
        {!newFile ? (
          <Button
            variant="contained"
            align="right"
            sx={{ minWidth: 100, minHeight: 50, m: 3 }}
            color="error"
            onClick={openDeleteDialog}
            startIcon={<Icon variant="delete" />}
          >
            Delete
          </Button>
        ) : null}
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} m={1}>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Title is required",
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  {...field}
                  label="Title"
                  variant="outlined"
                  fullWidth
                  error={invalid}
                  helperText={error?.message}
                  disabled={!newFile}
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} alignItems="center" m={1}>
            <FileUpload
              name="file"
              label="File Upload"
              type="document"
              control={control}
              maxFiles={1}
              maxSizeMB={maxFileSizeMB}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this file? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
