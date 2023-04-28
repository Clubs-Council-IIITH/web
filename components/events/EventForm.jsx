import { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/router";

import {
    Grid,
    Card,
    Stack,
    Button,
    Typography,
    TextField,
    Box,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Chip,
    FormControl,
    OutlinedInput,
    FormHelperText,
    CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { renderTimeViewClock } from "@mui/x-date-pickers";

import { useForm, Controller } from "react-hook-form";

import { useQuery } from "@apollo/client";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";
import { GET_AVAILABLE_LOCATIONS } from "gql/queries/events";

import { uploadFile } from "utils/files";
import { fileConstants } from "constants/files";
import { datetimeConstants } from "constants/datetime";

import Iconify from "components/iconify";
import ImageUpload from "components/ImageUpload";
import LoadingButton from "components/LoadingButton";
import { EventBudget } from "components/events";
import { fToISO } from "utils/formatTime";
import { useAuth } from "contexts/AuthContext";
import { audienceMap } from "constants/events";
import { locationLabel } from "utils/formatEvent";

export default function EventForm({
    defaultValues,
    submitMutation = console.log,
    submitState = {},
    submitButtonText = "Done",
}) {
    const router = useRouter();
    const { user } = useAuth();

    // check if form is submitting from the client side
    // needed to track multiple API calls (apart from the `submitState`, which is only for submitMutation)
    const [submitting, setSubmitting] = useState(false);

    // manage mode
    const [mode, setMode] = useState(defaultValues?.mode);
    const handleModeChange = useCallback(
        (_, newMode) => {
            setMode(newMode);
        },
        [setMode]
    );

    // manage audience
    const [audience, setAudience] = useState(defaultValues?.audience);
    const handleAudienceChange = useCallback(
        (_, newAudience) => {
            setAudience(newAudience);
        },
        [setAudience]
    );

    // manage poster upload
    const [poster, setPoster] = useState(defaultValues?.poster);
    const handlePosterDrop = useCallback(
        (files) => {
            const file = files[0];
            if (file) {
                setPoster(Object.assign(file, { preview: URL.createObjectURL(file) }));
            }
        },
        [setPoster]
    );

    // manage budget
    const emptyBudgetItem = { name: null, amount: 0, reimbursable: false };
    const [budget, setBudget] = useState(defaultValues?.budget);
    const addBudgetItem = () => {
        setBudget([...budget, { id: budget.length, ...emptyBudgetItem }]);
    };
    const deleteBudgetItem = (id) => {
        setBudget(budget.filter((r) => r.id !== id));
    };
    const editBudgetItem = (newRow) => {
        const newBudget = budget.map((r) => {
            if (r.id === newRow.id) {
                return newRow;
            }
            return r;
        });

        setBudget(newBudget);
        return newRow;
    };

    // controlled form
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({ defaultValues });

    // refresh form if default values change
    useEffect(() => {
        reset(defaultValues);
        if (defaultValues?.poster) setPoster(defaultValues?.poster);
        if (defaultValues?.audience) setAudience(defaultValues?.audience);
        if (defaultValues?.mode) setMode(defaultValues?.mode);
        if (defaultValues?.budget) setBudget(defaultValues?.budget);
    }, [defaultValues]);

    // watch start and end dates
    const startDateInput = watch("datetimeperiod.0");
    const endDateInput = watch("datetimeperiod.1");

    // watch location
    const locationInput = watch("location");

    // reset location input if start/end dates are modified
    useEffect(() => {
        if (
            // if start and end dates are same as default values, reset location to default value
            fToISO(startDateInput) === fToISO(defaultValues?.datetimeperiod[0]) &&
            fToISO(endDateInput) === fToISO(defaultValues?.datetimeperiod[1])
        ) {
            setValue("location", defaultValues?.location);
        } else {
            // else make location input null
            setValue("location", []);
        }
    }, [startDateInput, endDateInput]);

    // get available locations
    const { data: { availableRooms } = {}, loading: availableRoomsLoading } = useQuery(
        GET_AVAILABLE_LOCATIONS,
        {
            skip: !(startDateInput && endDateInput),
            variables: {
                timeslot: [fToISO(startDateInput), fToISO(endDateInput)],
            },
        }
    );

    // populate club IDs if user is CC
    const { data: { allClubs: clubs } = {}, loading: clubsLoading } = useQuery(GET_ALL_CLUB_IDS, {
        skip: user?.role !== "cc",
    });

    // submission logic
    const onSubmit = async (data) => {
        // start submitting form
        setSubmitting(true);

        // construct form data
        // upload poster if they are File objects (which they will be if they have been modified)
        const formData = {
            ...data,
            poster: poster,
            audience: audience,
            mode: mode,
            budget: budget,
        };

        // set club ID for event if current user is a club
        if (user?.role === "club") {
            formData.clubid = user?.uid;
        }

        // upload poster
        if (formData?.poster && typeof formData?.poster !== "string") {
            formData.poster = await uploadFile(poster, "image");
        }

        // convert dates to ISO strings
        formData.datetimeperiod = formData.datetimeperiod.map(fToISO);

        // convert budget to array of objects with only required attributes
        // remove budget items without a name (they're invalid)
        formData.budget = formData.budget
            .filter((i) => i?.name)
            .map((i) => ({
                description: i.description,
                amount: i.amount,
                reimbursable: i.reimbursable,
            }));

        // perform mutation
        submitMutation({
            variables: {
                details: formData,
            },
        });

        // finish submitting form
        setSubmitting(false);

        // redirect to manage page
        router.push("/manage/events");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={7} xl={8}>
                    <Card sx={{ p: 2 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            DETAILS
                        </Typography>

                        <Stack spacing={2}>
                            {/* show club selection input if current user is CC */}
                            {user?.role === "cc" ? (
                                <Controller
                                    name="clubid"
                                    control={control}
                                    rules={{ required: "Name can not be empty!" }}
                                    render={({ field }) =>
                                        clubsLoading ? (
                                            <Box w={100} display="flex" justifyContent="center">
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <FormControl>
                                                <InputLabel id="clubSelect">Club*</InputLabel>
                                                <Select
                                                    id="club"
                                                    labelId="clubSelect"
                                                    input={<OutlinedInput label="Location" />}
                                                    {...field}
                                                >
                                                    {clubs?.map((club) => (
                                                        <MenuItem key={club?.cid} value={club?.cid}>
                                                            {club?.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )
                                    }
                                />
                            ) : null}

                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Name can not be empty!" }}
                                render={({ field }) => (
                                    <TextField
                                        label="Name*"
                                        autoComplete="off"
                                        error={errors.name}
                                        helperText={errors.name?.message}
                                        InputLabelProps={{ shrink: field.value }}
                                        {...field}
                                    />
                                )}
                            />

                            <Stack direction="row" spacing={2}>
                                <Controller
                                    name="datetimeperiod.0"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            label="Starts*"
                                            format={`${datetimeConstants.dateFormat} ${datetimeConstants.timeFormat}`}
                                            sx={{ width: "100%" }}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                            {...field}
                                        />
                                    )}
                                />
                                <Controller
                                    name="datetimeperiod.1"
                                    control={control}
                                    render={({ field }) => (
                                        <DateTimePicker
                                            label="Ends*"
                                            format={`${datetimeConstants.dateFormat} ${datetimeConstants.timeFormat}`}
                                            sx={{ width: "100%" }}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock,
                                                seconds: renderTimeViewClock,
                                            }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Stack>

                            <Box>
                                <InputLabel shrink>Audience</InputLabel>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={audience}
                                    onChange={handleAudienceChange}
                                >
                                    {Object.keys(audienceMap).map((key) => (
                                        <ToggleButton disableRipple key={key} value={key}>
                                            {audienceMap[key]}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Box>

                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        multiline
                                        label="Description"
                                        autoComplete="off"
                                        rows={6}
                                        error={errors.description}
                                        helperText={errors.description?.message}
                                        InputLabelProps={{ shrink: field.value }}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="link"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        label="Link"
                                        autoComplete="off"
                                        error={errors.link}
                                        helperText={errors.link?.message}
                                        InputLabelProps={{ shrink: field.value }}
                                        {...field}
                                    />
                                )}
                            />
                        </Stack>
                    </Card>

                    <Card sx={{ p: 2, mt: 3 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            BUDGET
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={addBudgetItem}
                            sx={{ mb: 1 }}
                        >
                            <Iconify icon="mdi:plus" />
                            Add Item
                        </Button>
                        <EventBudget
                            rows={budget}
                            onUpdate={editBudgetItem}
                            onDelete={deleteBudgetItem}
                            editable={true}
                        />
                    </Card>
                </Grid>

                <Grid item xs md lg xl>
                    <Card sx={{ p: 2 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            VENUE
                        </Typography>

                        <Stack spacing={2}>
                            <Box>
                                <InputLabel shrink>Mode</InputLabel>
                                <ToggleButtonGroup
                                    exclusive
                                    color="primary"
                                    value={mode}
                                    onChange={handleModeChange}
                                >
                                    <ToggleButton disableRipple value={"hybrid"}>
                                        Hybrid
                                    </ToggleButton>
                                    <ToggleButton disableRipple value={"online"}>
                                        Online
                                    </ToggleButton>
                                    <ToggleButton disableRipple value={"offline"}>
                                        Offline
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {/* enable room booking only if event is hybrid/offline */}
                            {mode !== "online" ? (
                                <>
                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field }) =>
                                            availableRoomsLoading ? (
                                                <Box w={100} display="flex" justifyContent="center">
                                                    <CircularProgress />
                                                </Box>
                                            ) : (
                                                <FormControl>
                                                    <InputLabel id="locationSelect">
                                                        Location
                                                    </InputLabel>
                                                    <Select
                                                        multiple
                                                        id="location"
                                                        labelId="locationSelect"
                                                        disabled={!(startDateInput && endDateInput)}
                                                        input={<OutlinedInput label="Location" />}
                                                        renderValue={(selected) => (
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    flexWrap: "wrap",
                                                                    gap: 0.5,
                                                                }}
                                                            >
                                                                {selected.map((value) => (
                                                                    <Chip
                                                                        key={value}
                                                                        label={
                                                                            locationLabel(value)
                                                                                ?.name
                                                                        }
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
                                                        {...field}
                                                    >
                                                        {availableRooms?.locations
                                                            ?.slice()
                                                            ?.sort()
                                                            ?.map((location) => (
                                                                <MenuItem
                                                                    key={location}
                                                                    value={location}
                                                                >
                                                                    {locationLabel(location)?.name}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                    {!(startDateInput && endDateInput) ? (
                                                        <FormHelperText>
                                                            Enter start and end dates to get
                                                            available rooms
                                                        </FormHelperText>
                                                    ) : null}
                                                </FormControl>
                                            )
                                        }
                                    />

                                    {/* additional fields only if room is requested */}
                                    {locationInput?.length ? (
                                        <>
                                            <Controller
                                                name="population"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        type="number"
                                                        label="Expected Population Count"
                                                        autoComplete="off"
                                                        error={errors.population}
                                                        helperText={errors.population?.message}
                                                        InputLabelProps={{ shrink: field.value }}
                                                        {...field}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="equipment"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        multiline
                                                        label="Equipment Required"
                                                        autoComplete="off"
                                                        rows={3}
                                                        error={errors.equipment}
                                                        helperText={errors.equipment?.message}
                                                        InputLabelProps={{ shrink: field.value }}
                                                        {...field}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="additional"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        multiline
                                                        label="Additional Requests"
                                                        autoComplete="off"
                                                        rows={3}
                                                        error={errors.additional}
                                                        helperText={errors.additional?.message}
                                                        InputLabelProps={{ shrink: field.value }}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </>
                                    ) : null}
                                </>
                            ) : null}
                        </Stack>
                    </Card>

                    <Card sx={{ p: 2, mt: 3 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            MEDIA
                        </Typography>

                        <Stack spacing={2}>
                            <Box>
                                <InputLabel shrink>Poster</InputLabel>
                                <ImageUpload
                                    name="poster"
                                    accept="image/*"
                                    maxSize={fileConstants.maxSize}
                                    onDrop={handlePosterDrop}
                                    file={poster}
                                />
                            </Box>
                        </Stack>
                    </Card>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                        <Button
                            fullWidth
                            color="inherit"
                            variant="outlined"
                            size="large"
                            onClick={() => console.log("cancel")}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={(submitting || submitState?.loading) && !submitState?.error}
                        >
                            {submitButtonText}
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
}
