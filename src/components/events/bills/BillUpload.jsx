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
import EventBudget from "../EventBudget";

const maxFileSizeMB = 20;

export const validateBillno = (value) => {
  if (!value) return true; // Allow empty values
  return /^[A-Z0-9]+$/.test(value);
};

export default function BillUpload(params) {
  const {eventid, eventCode, budgetRows} = params;
  const [loading, setLoading] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      file: null, budget: budgetRows,
    },
  });

  const {triggerToast} = useToast();
  const router = useRouter();
  const fileDropzone = watch("file");

  async function onSubmit(data) {
    setLoading(true);

    try {
      // check all fields
      if (!data.file || !data.budget) {
        throw new Error("Please upload a file before proceeding.",);
      }
      // convert budget data values to required format
      const budget = data.budget
        .map((i) => ({
          description: i.description, amount: i.amount, advance: i.advance, billno: i.billno,
        }));

      const filename = await uploadPDFFile(data.file[0], false, eventCode + "_bill", maxFileSizeMB,);
      if (!filename) {
        throw new Error("File upload failed, check Title and File validity");
      }

      // send pdf to backend
      const res = await eventBillUpload({
        eventid: eventid, filename: filename, budget: budget,
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
          <Box m={2}>
            <Controller
              name="budget"
              control={control}
              rules={{
                validate: {
                  validBillNumbers: (value) => {
                    const invalidItems = value.filter(item => item.billno && !validateBillno(item.billno));
                    return invalidItems.length === 0 || "All bill numbers must contain only capital letters and digits";
                  }
                }
              }}
              render={({field: {value, onChange}}) => (<EventBudget
                editable={false}
                rows={value}
                setRows={onChange}
                billViewable={true}
                billEditable={true}
              />)}
            />
          </Box>

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
