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
import { useConfirm } from "material-ui-confirm";

import { useForm, Controller } from "react-hook-form";

import { useQuery } from "@apollo/client";
import { GET_ALL_CLUB_IDS } from "gql/queries/clubs";

import Iconify from "components/iconify";
import LoadingButton from "components/LoadingButton";
import { MemberRoles } from "components/members";
import { useAuth } from "contexts/AuthContext";

export default function MemberForm({
    defaultValues,
    submitMutation = console.log,
    submitState = {},
    submitButtonText = "Submit",
    defaultRoles = [],
}) {
    const router = useRouter();
    const { user } = useAuth();
    const confirm = useConfirm();

    // check if form is submitting from the client side
    // needed to track multiple API calls (apart from the `submitState`, which is only for submitMutation)
    const [submitting, setSubmitting] = useState(false);

    // manage roles
    const emptyRolesItem = { name: null, startYear: new Date().getFullYear(), endYear: null };
    const [roles, setRoles] = useState(defaultRoles);
    const addRolesItem = () => {
        setRoles([...roles, { id: roles.length, ...emptyRolesItem }]);
    };
    const deleteRolesItem = (id) => {
        setRoles(roles.filter((r) => r.id !== id));
    };
    const editRolesItem = (newRow) => {
        const newRoles = roles.map((r) => {
            if (r.id === newRow.id) {
                return newRow;
            }
            return r;
        });

        setRoles(newRoles);
        return newRow;
    };

    const [roleError, setRoleError] = useState(false);
    const [rolelengthError, setRoleLengthError] = useState(false);
    useEffect(() => {
        setRoleLengthError(roles?.length <= 0);
    }, [roles]);

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
        if (defaultValues?.roles) setRoles(defaultValues?.roles);
    }, [defaultValues]);

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
            cid: data?.cid,
            poc: data?.poc,
            uid: data?.email.substring(0, data?.email.indexOf("@")),
            roles: roles,
        };

        // set club ID for event if current user is a club
        if (user?.role === "club") {
            formData.cid = user?.uid;
        }

        // convert roles to array of objects with only required attributes
        // remove roles items without a name (they're invalid)
        formData.roles = formData.roles
            .filter((i) => i?.name)
            .map((i) => ({
                name: i.name,
                startYear: i.startYear,
                endYear: i.endYear,
            }));

        // perform mutation
        submitMutation({
            variables: {
                memberInput: formData,
            },
        });

        // finish submitting form
        setSubmitting(false);

        // redirect to manage page
        router.push("/manage/members");
    };

    const onCancel = () => {
        confirm({ title: "Cancellation", description: "Are you sure to do this!?", "confirmationText": "Yes" })
            .then(() => {
                router.back()
            })
            .catch(() => {
                // nothing
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <Card sx={{ p: 2, mt: 2 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            DETAILS
                        </Typography>

                        <Stack spacing={2}>
                            {/* show club selection input if current user is CC */}
                            {user?.role === "cc" ? (
                                <Controller
                                    name="cid"
                                    control={control}
                                    rules={{ required: "ID can not be empty!" }}
                                    render={({ field }) =>
                                        clubsLoading ? (
                                            <Box w={100} display="flex" justifyContent="center">
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <FormControl>
                                                <InputLabel id="clubSelect" shrink={!!field.value}>
                                                    Club*
                                                </InputLabel>
                                                <Select
                                                    id="clubSelect"
                                                    labelId="clubSelect"
                                                    input={<OutlinedInput label="Club*" />}
                                                    {...field}
                                                >
                                                    {clubs.slice()
                                                        ?.sort((a, b) => a.name.localeCompare(b.name))
                                                        ?.map((club) => (
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
                                name="email"
                                control={control}
                                rules={{ required: "Club email is required!" }}
                                render={({ field }) => (
                                    <TextField
                                        label="Email*"
                                        autoComplete="off"
                                        error={errors.email}
                                        helperText={errors.email?.message}
                                        InputLabelProps={{ shrink: field.value != "" && field.value != null }}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="poc"
                                control={control}
                                rules={{ required: "It can't be empty" }}
                                render={({ field }) =>
                                    <FormControl>
                                        <InputLabel id="clubSelect" shrink={field.value != null}>
                                            POC*
                                        </InputLabel>
                                        <Select
                                            id="clubSelect"
                                            labelId="clubSelect"
                                            input={<OutlinedInput label="POC*" />}
                                            {...field}
                                        >
                                            <MenuItem key={0} value={true}>
                                                YES
                                            </MenuItem>
                                            <MenuItem key={1} value={false}>
                                                NO
                                            </MenuItem>
                                        </Select>
                                    </FormControl>

                                }
                            />
                        </Stack>
                    </Card>

                    <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
                        <Button
                            fullWidth
                            color="inherit"
                            variant="outlined"
                            size="large"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={(submitting || submitState?.loading) && !submitState?.error}
                            disabled={roleError || rolelengthError}
                        >
                            {submitButtonText}
                        </LoadingButton>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={6} lg={6} xl={6}>
                    <Card sx={{ p: 2, mt: 2 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            ROLES
                        </Typography>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={addRolesItem}
                            sx={{ mb: 1 }}
                        >
                            <Iconify icon="mdi:plus" />
                            Add New Role
                        </Button>
                        <MemberRoles
                            rows={roles}
                            onUpdate={editRolesItem}
                            onDelete={deleteRolesItem}
                            editable={true}
                            roleError={roleError}
                            setRoleError={setRoleError}
                        />
                    </Card>
                </Grid>
            </Grid>
        </form>
    );
}