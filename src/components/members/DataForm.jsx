"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  MenuItem,
  CircularProgress,
  Switch,
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import { useToast } from "components/Toast";
import { useAuth } from "components/AuthProvider";
import { LoadingButton } from "@mui/lab";

import { getAllClubIds } from "actions/clubs/all-ids/server_action";
import { membersDataDownload } from "actions/members/data/server_action";

const allowed_roles = ["cc", "club", "slo", "slc"];
const admin_roles = ["cc", "slo", "slc"];
const disabledFields = ["uid", "clubid"]; // Fields that should be disabled and selected

function DataClubSelect({
  control,
  disabled = true,
  loading = false,
  clubs = [],
}) {
  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : clubs.length > 0 ? (
        <Controller
          name="clubid"
          control={control}
          rules={{ required: "Select a club/body!" }}
          render={({ field, fieldState: { error, invalid } }) => (
            <FormControl fullWidth error={invalid}>
              <InputLabel id="clubid-label">Club/Body</InputLabel>
              <Select
                labelId="clubid-label"
                label="Club/Body"
                fullWidth
                disabled={disabled}
                {...field}
              >
                <MenuItem value="allclubs">All Clubs/Bodies</MenuItem>
                {clubs
                  ?.slice()
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  ?.map((club) => (
                    <MenuItem key={club.cid} value={club.cid}>
                      {club.name}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      ) : (
        <Typography
          variant="body1"
          sx={{
            fontSize: 18,
            padding: 1.7,
            color: "#919EAB",
            width: "100%",
            border: "1px solid rgba(99, 115, 129, 0.5)",
            borderRadius: "8px",
          }}
        >
          No clubs available
        </Typography>
      )}
    </>
  );
}

export default function DataForm({ defaultValues = {}, action = "log" }) {
  const { user } = useAuth();
  const { triggerToast } = useToast();
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      clubid: "",
      fields: disabledFields, // Ensure disabled fields are selected by default
      typeMembers: "current",
      ...defaultValues,
    },
  });
  const [loading, setLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [cancelDialog, setCancelDialog] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllClubIds();
        if (!res.ok) {
          throw new Error(res.error.messages);
        }
        setClubs(res.data);
        setClubsLoading(false);
      } catch (error) {
        triggerToast({
          title: "Unable to fetch clubs",
          messages: [error.message],
          severity: "error",
        });
      }
    })();
  }, []);

  const submitHandlers = {
    log: console.log,
    create: async (data) => {
      let res = await membersDataDownload(data);

      if (res.ok) {
        try {
          const csvContent = res.data.downloadMembersData.csvFile;

          if (csvContent) {
            const csvBlob = new Blob([csvContent], {
              type: "text/csv;charset=utf-8;",
            });
            const csvFileName = `members_data_${dayjs(new Date()).format(
              "YYYY-MM-DD",
            )}.csv`;
            const downloadLink = document.createElement("a");
            const url = URL.createObjectURL(csvBlob);

            downloadLink.href = url;
            downloadLink.download = csvFileName;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          } else {
            console.error("No CSV content received");
          }
        } catch (error) {
          console.error("Failed to parse JSON response");
          triggerToast(error, "error");
        }
      } else {
        console.error("Failed to fetch CSV file");
        triggerToast({
          title: "Failed to fetch CSV file",
          messages: [res.error?.messages || "Unknown error"],
          severity: "error",
        });
      }
    },
  };

  async function onSubmit(formData) {
    setLoading(true);
    const data = {
      clubid: admin_roles.includes(user?.role) ? formData.clubid : user?.uid,
      fields: formData.fields,
    };
    submitHandlers[action](data);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h3" gutterBottom mb={3}>
        Download Members Data
      </Typography>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid container item>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            color="text.secondary"
            sx={{ mb: 1.5 }}
          >
            {admin_roles.includes(user?.role)
              ? "Select Club/Student Body"
              : "Selected Club/Student Body"}
          </Typography>
          <Grid item xs={12}>
            {admin_roles.includes(user?.role) ? (
              <DataClubSelect
                control={control}
                disabled={!admin_roles.includes(user?.role)}
                loading={clubsLoading}
                clubs={clubs}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  fontSize: 18,
                  padding: 1.7,
                  color: "#919EAB",
                  width: "100%",
                  border: "1px solid rgba(99, 115, 129, 0.5)",
                  borderRadius: "8px",
                }}
              >
                {clubs.find((club) => club.cid === user?.uid)?.name ||
                  user?.uid}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid container item>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            color="text.secondary"
            sx={{ mb: 1.5 }}
          >
            Members to Include
          </Typography>
          <Controller
            name="typeMembers"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="typeMembers">Type of Members</InputLabel>
                <Select
                  labelId="typeMembers"
                  label="typeMembers"
                  fullWidth
                  {...field}
                >
                  <MenuItem value="all">All Members</MenuItem>
                  <MenuItem value="current">Only Current Members</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid container item>
          <Typography
            variant="subtitle2"
            textTransform="uppercase"
            color="text.secondary"
            gutterBottom
          >
            Fields to Include
          </Typography>
          <Controller
            name="fields"
            control={control}
            rules={{ required: "Select at least one field!" }}
            render={({ field, fieldState: { error } }) => (
              <FormControl component="fieldset" fullWidth error={error}>
                <FormGroup row>
                  <Grid container item spacing={1} ml={1}>
                    {[
                      { fieldValue: "clubid", fieldName: "Club Name" },
                      { fieldValue: "uid", fieldName: "Member Name" },
                      { fieldValue: "poc", fieldName: "Is POC" },
                      { fieldValue: "roles", fieldName: "Roles" },
                    ].map(({ fieldValue, fieldName }) => (
                      <Grid item lg={2} md={3} sm={4} xs={6} key={fieldValue}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              value={fieldValue}
                              checked={field.value.includes(fieldValue)}
                              disabled={disabledFields.includes(fieldValue)}
                              onChange={(event) => {
                                const newValue = [...field.value];
                                if (event.target.checked) {
                                  newValue.push(event.target.value);
                                } else {
                                  const index = newValue.indexOf(
                                    event.target.value,
                                  );
                                  if (index > -1) {
                                    newValue.splice(index, 1);
                                  }
                                }
                                field.onChange(newValue);
                              }}
                            />
                          }
                          label={fieldName}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      <Grid container item direction="row" xs={12} spacing={1} pt={3}>
        <Grid item xs={6}>
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            fullWidth
            disabled={loading}
            onClick={() => setCancelDialog(true)}
          >
            Reset
          </Button>

          <ConfirmDialog
            open={cancelDialog}
            title="Confirm resetting"
            description="Are you sure you want to reset? All the selections will be lost."
            onConfirm={() => {
              reset();
              setCancelDialog(false);
            }}
            onClose={() => setCancelDialog(false)}
            confirmProps={{ color: "primary" }}
            confirmText="Yes, discard my changes"
          />
        </Grid>
        <Grid item xs={6}>
          {allowed_roles.includes(user?.role) && (
            <LoadingButton
              loading={loading}
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              fullWidth
            >
              Download CSV
            </LoadingButton>
          )}
        </Grid>
      </Grid>
    </form>
  );
}