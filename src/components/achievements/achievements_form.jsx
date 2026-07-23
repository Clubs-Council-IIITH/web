"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import dayjs, { isDayjs } from "dayjs";
import { Controller, useController, useForm, useWatch } from "react-hook-form";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Fade,
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
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { getActiveClubIds } from "actions/clubs/ids/server_action";
import FileUpload from "components/FileUpload";
import { useAuth } from "components/AuthProvider";
import { useToast } from "components/Toast";

const admin_roles=["slo", "slc", "cc"]
const allowed_role=["slo","slc", "cc", "club"]

export default function AchievementForm({
    id= null, 
    defaultValues={}
}){
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  
    const { triggerToast } = useToast();
    // fetch list of clubs
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
  
    const { control, handleSubmit, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues,
  });

  return (
    <form>
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
              disabled={false}
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
        <Grid size={12}>
              <FileUpload
                type="image"
                name="images"
                label="Images"
                control={control}
                maxFiles={5}
                maxSizeMB={100}
                shape="square"
                warnSizeMB={80}
              />

         </Grid>
         <Grid size={12}>
          <AchievementLinkInput control={control}/>
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
  disabled = true,
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
  }, [startDateInput]);


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
                  dayjs(value) > dayjs(startDateInput) ||
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


// // event link input
function AchievementLinkInput({ control }) {
  return (
    <Controller
      name="link"
      control={control}
      rules={{}}
      render={({ field, fieldState: { error, invalid } }) => (
        <TextField
          {...field}
          label="Link"
          autoComplete="off"
          error={invalid}
          helperText={
            error?.message ||
            "Link to any blog or article regarding the achievement"
          }
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}