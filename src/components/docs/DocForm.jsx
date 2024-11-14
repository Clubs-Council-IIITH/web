import React, { useState, useEffect, Error } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import FileUpload from 'components/FileUpload';
import Icon from 'components/Icon';
import { useToast } from 'components/Toast';

import { uploadPDFFile } from 'utils/files';

import { createStorageFile } from "actions/storagefiles/create/server_action";
import { updateStorageFile } from "actions/storagefiles/update/server_action";

export default function DocForm({
  editFile,
  onClose,
  open,
}) {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm();
  const { triggerToast } = useToast();
  const router = useRouter();

  async function onSubmit(data) {
    setLoading(true);

    try {
      const filename = await uploadPDFFile(data.file, true, data.title);
      if (!filename) {
        throw new Error("File upload failed, check Title and File validity");
      }

      if (!editFile) {
        // create event
        const res = await createStorageFile({
          title: data.title,
          url: filename,
          filetype: "pdf",
        });
        if (!res.ok) {
          throw new Error("Adding file to database failed!");
        }
      } else {
        // update existing event
        const res = await updateStorageFile(editFile._id);
        if (!res.ok) {
          throw new Error("Updating file to database failed!");
        }
      }

      triggerToast({
        title: 'Success!',
        messages: ['Document saved.'],
        severity: 'success',
      });
      router.refresh();
    } catch (error) {
      triggerToast({
        title: 'Error',
        messages: [error.message],
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
    >
      <DialogTitle sx={{
        m: 0,
        p: 2,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }}>
        <Typography variant="b2" sx={{pl: 2}}>Upload File</Typography>
        <IconButton
          onClick={onClose}
          size="small"
        >
          <Icon variant="close" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} m={1}>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: 'Title is required',
                }}
                render={({ field, fieldState: { error, invalid } }) => (
                  <TextField
                    {...field}
                    label="Title"
                    variant="outlined"
                    fullWidth
                    error={invalid}
                    defaultValue= {editFile?.title}
                    helperText={error?.message}
                    disabled={Boolean(editFile)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} alignItems="center">
              <FileUpload
                name="file"
                label="File Upload"
                type="document"
                control={control}
                maxFiles={1}
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
      </DialogContent>
    </Dialog>
  );
}
