"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import dayjs, { isDayjs } from "dayjs";
import { Controller, useForm, useWatch, useController } from "react-hook-form";
import { currentMembersAction } from "actions/members/current/server_action";

import {
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AchievementLinks  from "./AchievementLinks";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { getActiveClubIds } from "actions/clubs/ids/server_action";
import FileUpload from "components/FileUpload";
import { useAuth } from "components/AuthProvider";
import { useToast } from "components/Toast";
import { uploadImageFile } from "utils/files";
import { getFullUser } from "actions/users/get/full/server_action";
import { createAchievementAction } from "../../actions/achievements/create/server_action";
import { editAchievementAction } from "../../actions/achievements/edit/server_action";



export default function AchievementForm({
    id= null, 
    action = "create",
    defaultValues={}
}){
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { triggerToast } = useToast();

    const [clubs, setClubs] = useState([]);
    useEffect(() => {
      (async () => {
        let res = await getActiveClubIds();
        if (!res.ok) {
          triggerToast({
            title: "Unable to fetch clubs",
            messages: res.error.messages,
            severity: "error",
          });
        } else {
          setClubs(res.data);
        }
      })();
    }, []);
    const getUsers = useCallback(async (clubs) => {
      if (!clubs || clubs.length === 0) return [];

      const clubResults = await Promise.all(
        clubs.map((club) =>
          currentMembersAction({ cid: club?.cid || club?.id || club })
        )
      );

      const failedClubs = clubResults.filter((res) => !res?.ok);
      if (failedClubs.length > 0) {
        triggerToast({
          title: "Members cannot be fetched",
          messages: failedClubs.flatMap(
            (res) => res?.error?.messages || ["Unable to fetch members"]
          ),
          severity: "error",
        });
      }

      const allMembers = clubResults
        .filter((res) => res?.ok)
        .flatMap((res) => res.data);
      const uniqueUids = [...new Set(allMembers.map((m) => m.uid))];

      const userResults = await Promise.all(
        uniqueUids.map((uid) => getFullUser(uid))
      );

      const failedCount = userResults.filter((res) => !res?.ok).length;
      if (failedCount > 0) {
        triggerToast({
          title: "Some users couldn't be fetched",
          messages: [`${failedCount} users couldn't be fetched`],
          severity: "error",
        });
      }

      return userResults.filter((res) => res?.ok).map((res) => res.data);
    }, [triggerToast]);


    const { control, handleSubmit, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "",
      clubs: [],
      userids: [],
      dateperiod: [null, null],
      ...defaultValues,
      description: defaultValues?.content ?? "",
      type: defaultValues?.achievementType ?? "",
      clubs: defaultValues?.clubids ?? [],
      links: defaultValues?.blogLinks?.length
        ? defaultValues.blogLinks.map((url) => ({ url }))
        : [{ url: "" }],
    },
  });

  const submitHandlers = {
    log: console.log,
    create: async (data, opts) => {
      let res = await createAchievementAction(data);
      // console.log("CREATED ACHIEVEMENT: ",res);

      if (res.ok) {
        triggerToast({
          title: "Success!",
          messages:
            user?.role === "cc"
              ? ["Achievement created."]
              : ["Achievement created & saved as a draft."],
          severity: "success",
        });
        router.push(`/manage/achievements/${res.data._id}`);
      } else {
        triggerToast({
          severity: "error",
        });
        setLoading(false);
      }
    },
    edit: async (data, opts) => {

      let res = await editAchievementAction(data, id);
      // console.log("EDITED ACHIEVEMENT: ",res);
      if (res.ok) {
        triggerToast({
          title: "Success!",
          messages: ["Achievement edited"],
          severity: "success",
        });
        router.push(`/manage/achievements/${res.data._id}`);
      } else {
        triggerToast({
          severity: "error",
        });
        setLoading(false);
      }
    },
  }
  async function onSubmit(formData, opts) {
    setLoading(true);

    const data = {
      name: formData.name,
      clubids: (formData.clubs || []).filter(Boolean),
      achievementType: formData.type,
      content: formData.description,
      blogLinks: formData.links?.map((item) => item.url).filter(Boolean) || [],
      userids: (formData.userids || []).filter(Boolean),
    }

    // upload images
    const image_links = []
    if(formData.images){
    for (const image of formData.images) { 
      const filename = ("achievement_" + data.name + "_" + image.name
      ).replaceAll(".", "_",);

      const url = await uploadImageFile(
        image,
        filename,
        80,
      );

      image_links.push(url);
    }
  }

    // Bug fix: preserve existing images on edit when no new images are uploaded
    data.imageLinks = image_links.length
      ? image_links
      : action === "edit"
      ? (defaultValues?.imageLinks ?? [])
      : [];

    // convert dates to ISO strings
    data.dateperiod = formData.dateperiod.map((d) =>
      new Date(d).toISOString().split("T")[0]
    );
    // console.log(data);

    submitHandlers[action](data, opts);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container 
      spacing={4}
      sx={{
          alignItems: "flex-start",
      }}
      >
        <Grid
          container
          spacing={2}
          size={{
            xs: 12,
            md: 7,
            xl: 8,
          }}
        >
        <Grid container 
        sx={{display:"flex", 
          justifyContent:"flex-start",
          width:"100%"
        }}
        >
         <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  textTransform: "uppercase",
                  color: "text.secondary",
                  alignSelf: "center",
                  mb: 0,
                }}
              >
                Details
          </Typography>
        </Grid> 
        <Grid container spacing={2}>
          <Grid size={12}>
            <AchievementNameInput 
            control={control}
            />
          </Grid>
          <Grid size={12}>
            <AchievementContentInput
            control={control}
            />
          </Grid>
          <Grid size={12}>
            <AchievementDateInput 
              control={control} 
              setValue={setValue}
            />
          </Grid>
          <Grid container size={12} spacing={2}>
             <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  textTransform: "uppercase",
                  color: "text.secondary",
                  alignSelf: "center",
                  mb: 0,
                }}
              >
                Select your clubs
          </Typography>
                <ClubIdsSelector control={control} clubs={clubs}/>
          </Grid>
          <Grid size={12}>
             <UserIdsSelector control={control} getUser={getUsers}/>
          </Grid>
        </Grid>
        </Grid>
        
        <Grid container size={4} spacing={2}>
          <Grid size={12}>
        <Controller
        name="type"
        control={control}
        rules={{ required: 'Please select a type of achievement '}} 
        render={({ field, fieldState: { error } }) => (
          <FormControl error={Boolean(error)} margin="normal">
            <FormLabel id="plan-radio-group-label">  <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  textTransform: "uppercase",
                  color: "text.secondary",
                  alignSelf: "center",
                  mb: 0,
                }}
              >
               Type of achievement
          </Typography></FormLabel>
            
            <RadioGroup 
              {...field} 
              value={field.value || ""}
              row
              aria-labelledby="plan-radio-group-label"
            >
              <FormControlLabel value="project" control={<Radio />} label="Project" />
              <FormControlLabel value="competition" control={<Radio />} label="Competition" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>

            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

         </Grid>
        <Grid container size={12} spacing={3}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  textTransform: "uppercase",
                  color: "text.secondary",
                  alignSelf: "center",
                  mb: 0,
                }}
              >
                Images
            </Typography>
              <FileUpload
                type="image"
                name="images"
                control={control}
                maxFiles={5}
                maxSizeMB={100}
                shape="square"
                warnSizeMB={80}
              />

         </Grid>
         <Grid container size={12} spacing={3}>
             <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  textTransform: "uppercase",
                  color: "text.secondary",
                  alignSelf: "center",
                  mb: 0,
                }}
              >
                Blog links
            </Typography>
          <AchievementLinks control={control}/>
         
          <AchievementsSubmitButton
            loading={loading}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
          </Grid>

        </Grid>
      </Grid>
     
    </form>
  )
}



function AchievementsSubmitButton({
  loading,
  handleSubmit,
  onSubmit,
  disabled = false,
}) {

  const label = "Submit"
  const tooltipText = !disabled? "": "You are not authorized to submit"
  return (
    <Tooltip title={tooltipText} disableHoverListener={!tooltipText}>
      <span>
        <Button
          loading={loading}
          variant="contained"
          onClick={
             () => handleSubmit((data) =>
                    onSubmit(data, { shouldSubmit: true }),
                  )()
          }
          size="large"
          color="primary"
          fullWidth
          disabled={disabled}
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
}
   

function AchievementNameInput({ control, disabled = false}) {
  return (
    <Controller
      name="name"
      control={control}
      rules={{
        maxLength: {
          value: 150,
          message: "Achievement name must be at most 150 characters long!",
        },
        required: "Achievement name is required!",
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Name"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
          required
          disabled={disabled}
          onBlur={(e) => {
            field.onChange(e?.target?.value.trim());
          }}
        />
      )}
    />
  );
}


function ClubIdsSelector({
  control,
  defaultValue,
  disabled = false,
  clubs = [],
}) {
  const [open, setOpen] = useState(false);
  return (
    <Controller
      name="clubs"
      control={control}
      defaultValue={defaultValue}
      rules={{ required: "Select at least one club!" }}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="clubs">Clubs *</InputLabel>
          <Select
            labelId="clubs"
            label="Clubs *"
            fullWidth
            multiple
            disabled={disabled}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            input={<OutlinedInput label="Clubs *" />}
            {...field}
            value={field.value || []}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.filter(Boolean).map((value) => (
                  <Chip
                    key={value}
                    label={clubs.find((club) => club.cid === value)?.name}
                  />
                ))}
              </Box>
            )}
          >
            {/* Close button positioned in the top right corner */}
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{
                position: "sticky",
                top: 8,
                right: 8,
                zIndex: 1,
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  background: "rgba(230, 230, 230, 0.7)",
                },
                float: "right", // Ensures it stays to the right
              }}
            >
              <CloseIcon />
            </IconButton>

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
  );
}


function UserIdsSelector({
  control,
  defaultValue,
  disabled = false,
  getUser
}) {
  const { field } = useController({name: "userids", control})
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  let clubs = useWatch({
    control, 
    name:"clubs",
    defaultValue:[]
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // On initial mount, fetch users for any pre-populated clubs (edit form)
      // but do NOT reset userids — they may already be set via defaultValues.
      isFirstRender.current = false;
      if (clubs && clubs.length > 0) {
        (async () => {
          const res = await getUser(clubs);
          if (Array.isArray(res)) {
            setUsers(res);
          }
        })();
      }
      return;
    }

    // User changed clubs — reset their member selection and reload the list.
    field.onChange([]);
    if (!clubs || clubs.length === 0) {
      setUsers([]);
      return;
    }
    (async () => {
      const res = await getUser(clubs);
      if (Array.isArray(res)) {
        setUsers(res);
      }
    })();
  }, [clubs, getUser]);

  return (
    <Controller
      name="userids"
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <InputLabel id="users">Users</InputLabel>
          <Select
            labelId="users"
            label="Users"
            fullWidth
            multiple
            disabled={disabled}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            input={<OutlinedInput label="Users" />}
            {...field}
            value={field.value || []}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.filter(Boolean).map((value) => (
                  <Chip
                    key={value}
                    label={`${users.find((user) => user.uid === value)?.firstName ?? ""} ${users.find((user) => user.uid === value)?.lastName ?? ""}`.trim()}
                  />
                ))}
              </Box>
            )}
          >
            {/* Close button positioned in the top right corner */}
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{
                position: "sticky",
                top: 8,
                right: 8,
                zIndex: 1,
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  background: "rgba(230, 230, 230, 0.7)",
                },
                float: "right", // Ensures it stays to the right
              }}
            >
              <CloseIcon />
            </IconButton>

            {users
              ?.slice()
              ?.sort((a, b) => a.firstName.localeCompare(b.firstName))
              ?.map((user) => (
                <MenuItem key={user.uid} value={user.uid}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

function AchievementDateInput({
  control,
  setValue,
  disabled = false,
}) {
  const [startDateInput, endDateInput] = useWatch({
    control,
    name: ["dateperiod.0", "dateperiod.1"],
  });
  const [error, setError] = useState(null);

  const errorMessage = useMemo(() => {
    switch (error) {
      case "minDate": {
        return "An event can not end before it starts!";
      }
      case "invalidDate": {
        return "Invalid date!";
      }
      default: {
        return "";
      }
    }
  }, [error]);

  useEffect(() => {
    if (
      startDateInput &&
      endDateInput &&
      dayjs(startDateInput).isAfter(dayjs(endDateInput))
    )
      setValue("dateperiod.1", null);
  }, [startDateInput, endDateInput, setValue]);


  return (
    <Grid container spacing={2}>
      <Grid
        size={{
          xs: 12,
          md: 6,
          xl: 4,
        }}
      >
        <Controller
          name="dateperiod.0"
          control={control}
          rules={{
            required: "Start date is required!",
          }}
          render={({
            field: { value, onChange, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DatePicker
              disabled={disabled}
              label="Starts *"
              slotProps={{
                textField: {
                  error: invalid,
                  helperText: error?.message,
                },
              }}
      
          
              sx={{ width: "100%" }}
              value={
                value instanceof Date && !isDayjs(value) ? dayjs(value) : value
              }
              onChange={(newValue) => {
                onChange(newValue);
             
              }}
  
              format="DD/MM/YYYY"
              {...rest}
            />
          )}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
          xl: 4,
        }}
      >
        <Controller
          name="dateperiod.1"
          control={control}
          rules={{
            required: "End date is required!",
            validate: {
              checkDate: (value) => {
                return (
                  dayjs(value) >= dayjs(startDateInput) ||
                  "Achievement must end after it starts!"
                );
              },
            },
          }}
          render={({
            field: { value, onChange, ...rest },
            fieldState: { error, invalid },
          }) => (
            <DatePicker
              label="Ends *"
              minDate={
                startDateInput
                  ? (startDateInput instanceof Date && !isDayjs(startDateInput)
                      ? dayjs(startDateInput)
                      : startDateInput
                    )
                  : null
              }
              onError={(error) => setError(error)}
              slotProps={{
                textField: {
                  error: errorMessage || invalid,
                  helperText: errorMessage || error?.message,
                },
              }}
              sx={{ width: "100%" }}
              value={
                value instanceof Date && !isDayjs(value) ? dayjs(value) : value
              }
              onChange={(newValue) => {
                onChange(newValue);
              }}
              disabled={!startDateInput || disabled}
              format="DD/MM/YYYY"
              {...rest}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}



function AchievementContentInput({ control }) {
  return (
    <Controller
      name="description"
      control={control}
      rules={{
        maxLength: {
          value: 4000,
          message: "Content description must be at most 4000 characters long!",
        },
      }}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Description"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          rows={8}
          fullWidth
          multiline
          onBlur={(e) => {
            field.onChange(
              e?.target?.value.replace(/^[\s\n\t]+|[\s\n\t]+$/g, ""),
            );
          }}
        />
      )}
    />
  );
}

