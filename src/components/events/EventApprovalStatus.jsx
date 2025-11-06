import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import React from "react";

import { Box, Grid, Typography, Divider } from "@mui/material";

export default async function EventApprovalStatus(
  status,
  isStudentBodyEvent = false
) {
  let lastEditeduser = null;
  let ccApprover = null;
  let slcApprover = null;
  let deletedBy = null;

  if (status?.lastUpdatedBy) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.lastUpdatedBy,
        },
      });
      lastEditeduser = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  if (status?.ccApprover) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.ccApprover,
        },
      });
      ccApprover = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  if (status?.slcApprover) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.slcApprover,
        },
      });
      slcApprover = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  if (status?.deletedBy) {
    try {
      const { data: { userProfile } = {} } = await getClient().query(GET_USER, {
        userInput: {
          uid: status?.deletedBy,
        },
      });
      deletedBy = userProfile?.firstName + " " + userProfile?.lastName;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Divider sx={{ borderStyle: "dashed", my: 2 }} />
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        TIMELINE{" "}
        <Typography
          component="span"
          variant="caption"
          sx={{ marginLeft: 1, color: "text.secondary" }}
        >
          (Times in IST)
        </Typography>
      </Typography>

      <Grid container direction="column" spacing={0.5}>
        {[
          ["Last Edited", status?.lastUpdatedTime ? `Edited on ${status?.lastUpdatedTime}` : "Information not available"],
          ["Last Edited By", lastEditeduser],
          ["Event Submission", status?.submissionTime ? ( `Submitted on ${status?.submissionTime}` ) : "Information not available"],
          ["Clubs Council Approval", status?.ccApproverTime.includes("Not Approved") ? "Not Approved" : `Approved on ${status?.ccApproverTime}`],
          ["Students Life Council Approval", status?.slcApproverTime.includes("Not Approved") ? "Not Approved" : `Approved on ${status?.slcApproverTime}`],
          ["Students Life Office Approval", status?.sloApproverTime.includes("Not Approved") ? "Not Approved" : `Approved on ${status?.sloApproverTime}`],
        ].map(([label, value], i) => (
          <Grid
            key={i}
            columns={16}
            sx={{
              display: "grid",
              gridTemplateColumns: "3fr 10fr", // label 37.5%, value 62.5%
              borderBottom: "1px dashed #eee",
              py: 0.5,
            }}
          >
            <Box sx={{ color: "#555", fontWeight: 500 }}>{label}</Box>
            <Box
              sx={{
                color: value?.includes("Not Approved") ? "red" : "inherit",
              }}
            >
              {`- ${value}`}
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
