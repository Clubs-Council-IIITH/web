"use client";

import React, {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {useRouter} from "next/navigation";

import {
  Box, TextField, Button, Typography, Grid,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";

import Icon from "components/Icon";
import {useToast} from "components/Toast";
import FileUpload from "components/FileUpload";
import ConfirmDialog from "components/ConfirmDialog";

import {eventBillUpload} from "actions/events/bills/bill-upload/server_action";

import {uploadPDFFile} from "utils/files";

const maxFileSizeMB = 20;

export default function BillUpload(params) {
  const {eventid, eventCode} = params;
  const [loading, setLoading] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      file: null,
    },
  });

  const {triggerToast} = useToast();
  const router = useRouter();
  const fileDropzone = watch("file");

  async function onSubmit(data) {
    setLoading(true);

    try {
      // check all fields
      if (!data.file) {
        throw new Error("Please upload a file before proceeding.",);
      }

      const filename = await uploadPDFFile(data.file[0], false, eventCode + "_bill", maxFileSizeMB,);
      if (!filename) {
        throw new Error("File upload failed, check Title and File validity");
      }

      // create doc
      const res = await eventBillUpload({
        eventid: eventid, filename: filename,
      });
      if (!res.ok) {
        throw res.error;
      }

      triggerToast({
        title: "Success!", messages: ["Bill saved."], severity: "success",
      });
      router.push(`/manage/events/${eventid}`);
    } catch (error) {
      triggerToast({
        title: "Error",
        messages: error?.message ? [error.message] : error?.messages || ["Failed to save document"],
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitButton = () => {
    setSubmitDialogOpen(true);
  };

  return (<>
      <Grid container alignItems="center" justifyContent="space-between">
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
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
                // type="submit"
                onClick={handleSubmitButton}
                variant="contained"
                color="primary"
                disabled={loading || !fileDropzone}
              >
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
      <ConfirmDialog
        open={submitDialogOpen}
        title="Confirm submission"
        description={"Are you sure you want to submit the bill? You won't be able to edit the bill after submission, until SLO processes it."}
        onConfirm={() => handleSubmit((data) => onSubmit(data))()}
        onClose={() => setSubmitDialogOpen(false)}
        confirmProps={{color: "primary"}}
        confirmText="Proceed"
      />
    </>);
}
