import { useState, useEffect, useCallback } from "react";
import {
  Stack,
  Avatar,
  Box,
  Button,
  Tooltip,
  Container,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";

import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "gql/queries/users";
import { UPDATE_IMG } from "gql/mutations/users";

import { useAuth } from "contexts/AuthContext";
import { downloadFile, uploadFile } from "utils/files";

import useResponsive from "hooks/useResponsive";
import Page from "components/Page";

import ImageUpload from "components/ImageUpload";
import LoadingButton from "components/LoadingButton";

import { useProgressbar } from "contexts/ProgressbarContext";

export default function Profile() {
  const { user } = useAuth();
  const isDesktop = useResponsive("up", "sm");

  const {
    data: { userProfile, userMeta } = {},
    loading,
    error,
  } = useQuery(GET_USER_PROFILE, {
    skip: !user,
    variables: {
      userInput: { uid: user?.uid },
    },
  });

  const [updateImg, {}] = useMutation(UPDATE_IMG, {
    refetchQueries: [
      {
        query: GET_USER_PROFILE,
        variables: {
          userInput: { uid: user?.uid },
        },
      },
    ],
    onCompleted: () => setUploading(false),
  });

  // manage image upload
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(userMeta?.img);
  useEffect(() => setImage(userMeta?.img), [userMeta]);

  const handleImageDrop = useCallback(
    (files) => {
      const file = files[0];
      if (file) {
        setImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    },
    [setImage]
  );

  const onSubmit = async () => {
    const imgID = await uploadFile(image, "image");
    updateImg({
      variables: { imgInput: { uid: user.uid, img: imgID } },
    });
  };

  // track loading state
  const { trackProgress } = useProgressbar();
  useEffect(() => trackProgress(loading), [loading]);

  return !userProfile ? null : (
    <Page title="Profile">
      <Container>
        <Grid container spacing={2}>
          <Grid container item xs={12} sx={{ flexDirection: "row", alignItems: "center" }}>
            {uploading ? (
              <Box mr={3} mb={isDesktop ? 0 : 2}>
                <ImageUpload name="img" accept="image/*" onDrop={handleImageDrop} file={image} />
                <Stack mt={1} direction="row" spacing={1}>
                  <Button
                    fullWidth
                    color="inherit"
                    variant="outlined"
                    size="large"
                    onClick={() => setUploading(false)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    fullWidth
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={onSubmit}
                  >
                    Save
                  </LoadingButton>
                </Stack>
              </Box>
            ) : (
              <Tooltip title="Upload photo">
                <IconButton onClick={() => setUploading(true)} sx={{ mr: 3 }}>
                  <Avatar
                    src={downloadFile(userMeta?.img)}
                    alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                    sx={{ width: isDesktop ? 150 : 80, height: isDesktop ? 150 : 80 }}
                  />
                </IconButton>
              </Tooltip>
            )}
            <Box>
              <Typography
                variant="h3"
                gutterBottom
              >{`${userProfile?.firstName} ${userProfile?.lastName}`}</Typography>
              <Typography fontFamily="monospace">{userProfile?.email}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
