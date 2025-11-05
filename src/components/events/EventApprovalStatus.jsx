import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";

import { Box, Grid, Typography, Divider } from "@mui/material";

export default async function EventApprovalStatus(
  status,
  isStudentBodyEvent = false,
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
      <Typography variant="subtitle2" gutterBottom>
        TIMELINE{" "}
        <Typography variant="caption" gutterBottom sx={{ marginLeft: 1 }}>
          (Times in IST)
        </Typography>
      </Typography>
      <Grid container spacing={2}>
        <Grid container item spacing={2}>
          <Grid item xs={5} lg={3}>
            <Box sx={{
              mt: 2
            }}>Last Edited</Box>
          </Grid>
          <Grid item xs={1} lg={0.1}>
            <Box sx={{
              mt: 2
            }}>-</Box>
          </Grid>
          <Grid item xs>
            <Box
              sx={{
                mt: 2,
                color: status?.lastUpdatedTime == null ? "#5a5a5a" : "inherit"
              }}>
              {status?.lastUpdatedTime == null
                ? "Information not available"
                : (status?.lastUpdatedTime.includes(":") ? "Edited on " : "") +
                  status?.lastUpdatedTime}
            </Box>
          </Grid>
        </Grid>
        {status?.lastUpdatedBy != null ? (
          <Grid container item spacing={2}>
            <Grid item xs={5} lg={3}>
              <Box sx={{
                mt: 0
              }}>Last Edited By</Box>
            </Grid>
            <Grid item xs={1} lg={0.1}>
              <Box sx={{
                mt: 0
              }}>-</Box>
            </Grid>
            <Grid item xs>
              <Box sx={{
                mt: 0
              }}>{lastEditeduser}</Box>
            </Grid>
          </Grid>
        ) : null}
        {status?.state && status?.state == "deleted" ? (
          <>
            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box sx={{
                  mt: 1
                }}>Event Deletion</Box>
              </Grid>
              <Grid item xs={1} lg={0.1}>
                <Box sx={{
                  mt: 1
                }}>-</Box>
              </Grid>
              <Grid item xs>
                <Box
                  sx={{
                    mt: 1,
                    color: status?.deletedTime == null ? "#5a5a5a" : "inherit"
                  }}>
                  {status?.deletedTime == null
                    ? "Information not available"
                    : (status?.deletedTime.includes(":") ? "Deleted on " : "") +
                      status?.deletedTime}
                </Box>
              </Grid>
            </Grid>
            {status?.deletedTime != null && status?.deletedBy != null ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box sx={{
                    mt: 0
                  }}>Event Deleted By</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box sx={{
                    mt: 0
                  }}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box sx={{
                    mt: 0
                  }}>{deletedBy}</Box>
                </Grid>
              </Grid>
            ) : null}
          </>
        ) : status?.state && status?.state !== "incomplete" ? (
          <>
            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box sx={{
                  mt: 1
                }}>Event Submission</Box>
              </Grid>
              <Grid item xs={1} lg={0.1}>
                <Box sx={{
                  mt: 1
                }}>-</Box>
              </Grid>
              <Grid item xs>
                <Box
                  sx={{
                    mt: 1,

                    color:
                      status?.submissionTime == null ? "#5a5a5a" : "inherit"
                  }}>
                  {status?.submissionTime == null
                    ? "Information not available"
                    : (status?.submissionTime.includes(":")
                        ? "Submitted on "
                        : "") + status?.submissionTime}
                </Box>
              </Grid>
            </Grid>

            {!isStudentBodyEvent ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box sx={{
                    mt: 1
                  }}>Clubs Council Approval</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box sx={{
                    mt: 1
                  }}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box
                    sx={{
                      mt: 1,

                      color:
                        status?.ccApproverTime == null ? "#5a5a5a" : "inherit"
                    }}>
                    {status?.ccApproverTime == null
                      ? "Information not available"
                      : (status?.ccApproverTime.includes(":")
                          ? "Approved on "
                          : "") + status?.ccApproverTime}
                  </Box>
                </Grid>
              </Grid>
            ) : null}

            {status?.ccApprover != null && status?.ccApproverTime != null ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box sx={{
                    mt: 0
                  }}>Clubs Council Approved By</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box sx={{
                    mt: 0
                  }}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box sx={{
                    mt: 0
                  }}>{ccApprover}</Box>
                </Grid>
              </Grid>
            ) : null}

            {!isStudentBodyEvent ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box sx={{
                    mt: 1
                  }}>Students Life Council Approval</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box sx={{
                    mt: 1
                  }}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box
                    sx={{
                      mt: 1,

                      color:
                        status?.slcApproverTime == null ? "#5a5a5a" : "inherit"
                    }}>
                    {status?.slcApproverTime == null
                      ? "Information not available"
                      : (status?.slcApproverTime.includes(":")
                          ? "Approved on "
                          : "") + status?.slcApproverTime}
                  </Box>
                </Grid>
              </Grid>
            ) : null}
            {status?.slcApprover != null && status?.slcApproverTime != null ? (
              <Grid container item spacing={2}>
                <Grid item xs={5} lg={3}>
                  <Box sx={{
                    mt: 0
                  }}>Students Life Council Approved By</Box>
                </Grid>
                <Grid item xs={1} lg={0.1}>
                  <Box sx={{
                    mt: 0
                  }}>-</Box>
                </Grid>
                <Grid item xs>
                  <Box sx={{
                    mt: 0
                  }}>{slcApprover}</Box>
                </Grid>
              </Grid>
            ) : null}

            <Grid container item spacing={2}>
              <Grid item xs={5} lg={3}>
                <Box sx={{
                  mt: 1
                }}>Students Life Office Approval</Box>
              </Grid>
              <Grid item xs={1} lg={0.1}>
                <Box sx={{
                  mt: 1
                }}>-</Box>
              </Grid>
              <Grid item xs>
                <Box
                  sx={{
                    mt: 1,

                    color:
                      status?.sloApproverTime == null ? "#5a5a5a" : "inherit"
                  }}>
                  {status?.sloApproverTime == null
                    ? "Information not available"
                    : (status?.sloApproverTime.includes(":")
                        ? "Approved on "
                        : "") + status?.sloApproverTime}
                </Box>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
    </>
  );
}
