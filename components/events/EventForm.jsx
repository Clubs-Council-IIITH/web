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
    Switch,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useForm, Controller } from "react-hook-form";

import { uploadFile } from "utils/files";
import { datetimeConstants } from "constants/datetime";

import { EventBudget } from "components/events";

import Iconify from "components/iconify";
import ImageUpload from "components/ImageUpload";
import LoadingButton from "components/LoadingButton";
import { renderTimeViewClock } from "@mui/x-date-pickers";

export default function EventForm({
    defaultValues,
    submitMutation = console.log,
    submitState = {},
    submitButtonText = "Done",
}) {
    const router = useRouter();

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

        // preprocess certain values
        if (formData?.poster && typeof formData?.poster !== "string") {
            formData.poster = await uploadFile(poster, "image");
        }

        // perform mutation
        submitMutation({
            variables: {
                eventInput: formData,
            },
        });

        // finish submitting form
        setSubmitting(false);

        // redirect to manage page
        router.push("/manage/clubs");
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
                                    name="datetimeStarts"
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
                                    name="datetimeEnds"
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
                                    <ToggleButton disableRipple value="ug1">
                                        UG1
                                    </ToggleButton>
                                    <ToggleButton disableRipple value="ug2">
                                        UG2
                                    </ToggleButton>
                                    <ToggleButton disableRipple value="ug3">
                                        UG3
                                    </ToggleButton>
                                    <ToggleButton disableRipple value="ug4">
                                        UG4+
                                    </ToggleButton>
                                    <ToggleButton disableRipple value="pg">
                                        PG
                                    </ToggleButton>
                                    <ToggleButton disableRipple value="stf">
                                        Staff
                                    </ToggleButton>
                                    <ToggleButton disableRipple value="fac">
                                        Faculty
                                    </ToggleButton>
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
                                    <ToggleButton disableRipple value={0}>
                                        Hybrid
                                    </ToggleButton>
                                    <ToggleButton disableRipple value={1}>
                                        Online
                                    </ToggleButton>
                                    <ToggleButton disableRipple value={2}>
                                        Offline
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {mode !== 1 ? (
                                <>
                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                label="Location"
                                                autoComplete="off"
                                                error={errors.location}
                                                helperText={errors.location?.message}
                                                InputLabelProps={{ shrink: field.value }}
                                                {...field}
                                            />
                                        )}
                                    />

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
                                    maxSize={3145728} // TODO: set file size limits
                                    onDrop={handlePosterDrop}
                                    file={poster}
                                    // shape="circle"
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
