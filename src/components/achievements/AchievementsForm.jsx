"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AchievementImages from "./AchievementImages";
import dayjs, { isDayjs } from "dayjs";
import { Controller,  useForm, useWatch } from "react-hook-form";

import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
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
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";

import { useAuth } from "components/AuthProvider";
import FileUpload from "components/FileUpload";
import { useToast } from "components/Toast";
import { uploadImageFile } from "utils/files";

import { getActiveClubIds } from "actions/clubs/ids/server_action";
import { currentMembersAction } from "actions/members/current/server_action";
import { getFullUser } from "actions/users/get/full/server_action";

import { createAchievementAction } from "../../actions/achievements/create/server_action";
import { editAchievementAction } from "../../actions/achievements/edit/server_action";
import AchievementLinks from "./AchievementLinks";
import AchievementNewUser from "./AchievementNewUser"



export default function AchievementForm({
    id= null, 
    action = "create",
    defaultValues={}
}){
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { triggerToast } = useToast();

  const clubId = user?.role === "club" ? user?.uid : null;
  const [clubMemberUids, setClubMemberUids] = useState([]);
  const [externalUsers, setExternalUsers] = useState([]);
  const [external, setExternal] = useState(false)

  useEffect(() => {
    if (clubId) {
      (async () => {
        const res = await currentMembersAction({ cid: clubId });
        if (res.ok) {
          setClubMemberUids(res.data.map((m) => m.uid));
        }
      })();
    }
  }, [clubId]);

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
    }, [triggerToast]);

  const defaultClubs = useMemo(() => {
    let baseClubs = defaultValues?.clubids ?? [];
    if (clubId && !baseClubs.includes(clubId)) {
      return [clubId, ...baseClubs];
    }
    return baseClubs;
  }, [defaultValues?.clubids, clubId]);

    const getUsers = useCallback(async (clubs) => {
      const validCids = (clubs || [])
        .map((club) => club?.cid || club?.id || club)
        .filter(Boolean);

      if (validCids.length === 0) return [];

      const clubResults = await Promise.all(
        validCids.map((cid) => currentMembersAction({ cid }))
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
      const uniqueUids = [...new Set(allMembers.map((m) => m.uid).filter(Boolean))];

      const userResults = await Promise.all(
        uniqueUids.map(async (uid) => {
          const res = await getFullUser(uid);
          if (res?.ok && res?.data) {
            return res.data;
          }
          return null
        })
      );

      return userResults;
    }, []);


    const { control, handleSubmit, setValue, getValues, watch, reset, trigger, setError } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "",
      clubs: defaultClubs,
      userids: [],
      dateperiod: [null, null],
      ...defaultValues,
      description: defaultValues?.content ?? "",
      type: defaultValues?.achievementType ?? "",
      links: defaultValues?.blogLinks?.length
        ? defaultValues.blogLinks.map((url) => ({ url }))
        : [],
      venue: defaultValues?.venue ?? "",
    },
  });

  const selectedClubs = watch("clubs");

  useEffect(() => {
    if (user?.role === "club" && user?.uid) {
      const currentClubs = getValues("clubs") || [];
      if (!currentClubs.includes(user.uid)) {
        setValue("clubs", [user.uid, ...currentClubs]);
      }
    }
  }, [user, setValue, getValues]);

  useEffect(() => {
    if (action === "edit" && defaultValues?.clubids) {
      reset({
        ...defaultValues,
        name: defaultValues.name ?? "",
        dateperiod: defaultValues.dateperiod ?? [null, null],
        description: defaultValues.content ?? "",
        type: defaultValues.achievementType ?? "",
        clubs: defaultClubs,
        links: defaultValues.blogLinks?.length
          ? defaultValues.blogLinks.map((url) => ({ url }))
          : [],
        venue: defaultValues.venue ?? "",
      });
    }
  }, [action, defaultValues, reset, defaultClubs]);

  useEffect(() => {
    if (action === "edit" && defaultValues?.userids) {
      (async() =>{
        const currentUsers = await Promise.all(
          defaultValues.userids.map(async(uid) => {
            const res = await getFullUser(uid);
            if(res?.ok && res?.data) {
              return res.data;
            }
            return null;
          })
        )
        setExternalUsers(currentUsers.filter(Boolean));
      })();
    };
  },[defaultValues?.userids, action]);

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
      console.log("EDITED ACHIEVEMENT: ",res);
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
      venue: formData.venue.trim() || null,
    }
    console.log("SUBMIT VENUE:", formData.venue, data.venue);
    const clubUsers = await getUsers(data.clubids);
    const users = [...clubUsers, ...externalUsers]
    if(!data.userids || data.userids.length==0 || !data.userids.every((value)=>users.some((x)=>x.uid==value))){
      setError("userids", { message: "Every user id must be either external or from one of the selected clubs" });
      setLoading(false);
      return;
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
          <Grid size={12}>
            <AchievementVenueInput
              control={control}
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
              <UserIdsSelector trigger={trigger} control={control} getUser={getUsers} clubMemberUids={clubMemberUids} setValue={setValue} selectedClubs={selectedClubs} externalUsers={externalUsers}/>
          </Grid>
          <Grid size={12} spacing={2}>
            <Button onClick={() => setExternal(prev => !prev)}>
              Add External Users 
            </Button>
            <Box
              sx={{
                my: 1,
              }}
            />
            {external && 
              <AchievementNewUser control={control} setValue={setValue}
                onVerifiedUser={(user) => {
                  setExternalUsers((prev) => [...prev, user]);
                  const currentUsers = getValues("userids") || [];

                  setValue("userids", [...currentUsers, user.uid]);
                }}
              />
            }
          </Grid>
          <Grid size={12}>
           
            {action=="edit"&& watch("imageLinks").length!=0 && 
            <>  
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
              >
             These are the existing images. Uploading new images will remove these as well.
            </Typography>
             <AchievementImages padding="70%" achievement={{"name": watch("name"), "imageLinks" :watch("imageLinks")}}></AchievementImages></>}
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
            <FormLabel id="plan-radio-group-label">  
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
               Type of achievement
              </Typography>
            </FormLabel>
            
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

function AchievementVenueInput({ control }) {
  return (
    <Controller
      name="venue"
      control={control}
      rules={{
        maxLength: {
          value: 150,
          message: "Venue must be at most 150 characters long!"
        },
      }}
      render={({ field, fieldState: {error, invalid } }) => (
        <TextField 
          {...field}
          label="Venue"
          autoComplete="off"
          error={invalid}
          helperText={error?.message}
          variant="outlined"
          fullWidth
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
  const { user } = useAuth();
  return (
    <Controller
      name="clubs"
      control={control}
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
            onChange={(e) => {
              let val = e.target.value;
              if (user?.role === "club" && user?.uid && !val.includes(user.uid)) {
                val = [user.uid, ...val];
              }
              field.onChange(val);
            }}
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
                <MenuItem
                  key={club.cid}
                  value={club.cid}
                  disabled={user?.role === "club" && club.cid === user?.uid}
                >
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
  trigger, 
  control,
  disabled = false,
  getUser,
  clubMemberUids = [],
  setValue,
  selectedClubs = [],
  externalUsers = [],
}) {
  const [open, setOpen] = useState(false);
  const [clubUsers, setClubUsers] = useState([]);
  const { user } = useAuth();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (selectedClubs && selectedClubs.length > 0) {
        (async () => {
          const res = await getUser(selectedClubs);
          if (Array.isArray(res)) {
            setClubUsers(res);
          }
        })();
      }
      return;
    }

    // User changed clubs — reset their member selection and reload the list.
    if (!selectedClubs || selectedClubs.length === 0) {
      setClubUsers([]);
      return;
    }
    (async () => {
      const res = await getUser(selectedClubs);
      if (Array.isArray(res)) {
        setClubUsers(res);
      }
    })();
  }, [selectedClubs, getUser, setValue]);
  useEffect(() => {                                                                            
      trigger("userids");                                                                        
    }, [clubUsers, trigger]);    
  const users = [
    ...new Map(
      [...clubUsers, ...externalUsers].map((user) => [user.uid, user])
    ).values(),
  ];
  const userRef = useRef(users);
  userRef.current = users;

  const clubMemberUidsRef = useRef(clubMemberUids);
  clubMemberUidsRef.current = clubMemberUids;

  return (
    <Controller
      name="userids"
      control={control}
      rules={
        user?.role === "club"
          ? {
            validate: {
              atLeastOneMember: (value) => {
                if (!value || value.length === 0) return true;
                const hasMember = value.some((uid) =>
                  clubMemberUidsRef.current.some(
                    (cuid) => String(cuid).toLowerCase() === String(uid).toLowerCase()
                  )
                );
                return (
                  hasMember ||
                  "At least one member of your club must be selected!"
                );
              },

            },
          }
          : {  
          }
      }
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
                    onMouseDown={(e)=>e.stopPropagation()}
                    key={value}
                    onDelete={() => {setValue("userids", selected.filter((x) => x !== value), { shouldValidate: true });        
                         }}
                    label={`${users.find((u) => u.uid === value)?.firstName ?? "Invalid User"} ${users.find((u) => u.uid === value)?.lastName ?? ""}`.trim()}
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
              ?.map((u) => (
                <MenuItem key={u.uid} value={u.uid}>
                  {u.firstName} {u.lastName}
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

