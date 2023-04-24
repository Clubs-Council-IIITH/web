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
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

import { uploadFile } from "utils/files";

import Iconify from "components/iconify";
import ImageUpload from "components/ImageUpload";
import LoadingButton from "components/LoadingButton";
import { RichTextEditor } from "components/RichTextEditor";

export default function ClubForm({
    defaultValues,
    submitMutation = console.log,
    submitState = {},
    disableRequiredFields = false,
    submitButtonText = "Done",
}) {
    const router = useRouter();

    // check if form is submitting from the client side
    // needed to track multiple API calls (apart from the `submitState`, which is only for submitMutation)
    const [submitting, setSubmitting] = useState(false);

    // manage rich-text description
    const [description, setDescription] = useState(
        defaultValues?.description || [{ type: "paragraph", children: [{ text: "" }] }]
    );

    // manage logo upload
    const [logo, setLogo] = useState(defaultValues?.logo);
    const handleLogoDrop = useCallback(
        (files) => {
            const file = files[0];
            if (file) {
                setLogo(Object.assign(file, { preview: URL.createObjectURL(file) }));
            }
        },
        [setLogo]
    );

    // manage banner upload
    const [banner, setBanner] = useState(defaultValues?.banner);
    const handleBannerDrop = useCallback(
        (files) => {
            const file = files[0];
            if (file) {
                setBanner(Object.assign(file, { preview: URL.createObjectURL(file) }));
            }
        },
        [setBanner]
    );

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
        if (defaultValues?.logo) setLogo(defaultValues?.logo);
        if (defaultValues?.banner) setBanner(defaultValues?.banner);
        if (defaultValues?.description) setDescription(defaultValues?.description);
    }, [defaultValues]);

    // submission logic
    const onSubmit = async (data) => {
        // start submitting form
        setSubmitting(true);

        // construct form data
        // upload logo and banner if they are File objects (which they will be if they have been modified)
        const formData = {
            ...data,
            description: description,
            logo: logo,
            banner: banner,
        };

        // preprocess certain values
        if (formData?.description) {
            formData.description = JSON.stringify(formData.description);
        }
        if (formData?.logo && typeof formData?.logo !== "string") {
            formData.logo = await uploadFile(logo, "image");
        }
        if (formData?.banner && typeof formData?.banner !== "string") {
            formData.banner = await uploadFile(banner, "image");
        }

        // perform mutation
        submitMutation({
            variables: {
                clubInput: formData,
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
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            DETAILS
                        </Typography>

                        <Stack spacing={2}>
                            <Controller
                                name="cid"
                                control={control}
                                rules={{ required: "Club ID can not be empty!" }}
                                render={({ field }) => (
                                    <TextField
                                        label="Club ID*"
                                        autoComplete="off"
                                        error={errors.cid}
                                        helperText={errors.cid?.message}
                                        disabled={disableRequiredFields}
                                        InputLabelProps={{ shrink: field.value }}
                                        {...field}
                                    />
                                )}
                            />

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
                                        disabled={disableRequiredFields}
                                        InputLabelProps={{ shrink: field.value }}
                                        {...field}
                                    />
                                )}
                            />

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
                                        disabled={disableRequiredFields}
                                        InputLabelProps={{ shrink: field.value }}
                                        {...field}
                                    />
                                )}
                            />

                            <Box>
                                <InputLabel shrink>Category*</InputLabel>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            fullWidth
                                            disabled={disableRequiredFields}
                                            {...field}
                                        >
                                            <MenuItem value="cultural">Cultural</MenuItem>
                                            <MenuItem value="technical">Technical</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                        </Select>
                                    )}
                                />
                            </Box>

                            <Controller
                                name="tagline"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        label="Tagline"
                                        autoComplete="off"
                                        error={errors.tagline}
                                        helperText={errors.tagline?.message}
                                        InputLabelProps={{ shrink: field.value }}
                                        {...field}
                                    />
                                )}
                            />

                            <Box>
                                <InputLabel shrink>Description</InputLabel>
                                <Box
                                    border={1}
                                    borderColor={"grey.300"}
                                    borderRadius={1}
                                    py={1}
                                    px={2}
                                >
                                    <RichTextEditor
                                        editing={true}
                                        editorState={[description, setDescription]}
                                    />
                                </Box>
                            </Box>
                        </Stack>
                    </Card>

                    <Card sx={{ p: 3, mt: 3 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            SOCIALS
                        </Typography>

                        <Stack spacing={2}>
                            <Box display="flex" alignItems="center" w={100}>
                                <Iconify icon="mdi:web" mr={2} />
                                <Controller
                                    name="socials.website"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Website"
                                            autoComplete="off"
                                            error={errors.socials?.website}
                                            InputLabelProps={{ shrink: field.value }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>

                            <Box display="flex" alignItems="center" w={100}>
                                <Iconify icon="mdi:instagram" mr={2} />
                                <Controller
                                    name="socials.instagram"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Instagram"
                                            autoComplete="off"
                                            error={errors.socials?.instagram}
                                            InputLabelProps={{ shrink: field.value }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>

                            <Box display="flex" alignItems="center" w={100}>
                                <Iconify icon="ic:baseline-facebook" mr={2} />
                                <Controller
                                    name="socials.facebook"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Facebook"
                                            autoComplete="off"
                                            error={errors.socials?.facebook}
                                            InputLabelProps={{ shrink: field.value }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>

                            <Box display="flex" alignItems="center" w={100}>
                                <Iconify icon="mdi:youtube" mr={2} />
                                <Controller
                                    name="socials.youtube"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="YouTube"
                                            autoComplete="off"
                                            error={errors.socials?.youtube}
                                            InputLabelProps={{ shrink: field.value }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>

                            <Box display="flex" alignItems="center" w={100}>
                                <Iconify icon="mdi:twitter" mr={2} />
                                <Controller
                                    name="socials.twitter"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Twitter"
                                            autoComplete="off"
                                            error={errors.socials?.twitter}
                                            InputLabelProps={{ shrink: field.value }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>

                            <Box display="flex" alignItems="center" w={100}>
                                <Iconify icon="mdi:linkedin" mr={2} />
                                <Controller
                                    name="socials.linkedin"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="LinkedIn"
                                            autoComplete="off"
                                            error={errors.socials?.linkedin}
                                            InputLabelProps={{ shrink: field.value }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>

                            <Box display="flex" alignItems="center" w={100}>
                                <Iconify icon="ic:baseline-discord" mr={2} />
                                <Controller
                                    name="socials.discord"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Discord"
                                            autoComplete="off"
                                            error={errors.socials?.discord}
                                            InputLabelProps={{ shrink: field.value }}
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3 }}>
                        <Typography color="text.secondary" variant="subtitle2" pb={2}>
                            MEDIA
                        </Typography>

                        <Stack spacing={2}>
                            <Box>
                                <InputLabel shrink>Logo</InputLabel>
                                <ImageUpload
                                    name="logo"
                                    accept="image/*"
                                    maxSize={3145728} // TODO: set file size limits
                                    onDrop={handleLogoDrop}
                                    file={logo}
                                    // shape="circle"
                                />
                            </Box>

                            <Box>
                                <InputLabel shrink>Banner</InputLabel>
                                <ImageUpload
                                    name="banner"
                                    accept="image/*"
                                    maxSize={3145728} // TODO: set file size limits
                                    onDrop={handleBannerDrop}
                                    file={banner}
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