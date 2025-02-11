import { redirect } from "next/navigation";
import {
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_USER_PROFILE } from "gql/queries/users";
import { GET_USER_CERTIFICATES } from "gql/queries/members";
import UserDetails from "components/profile/UserDetails";
import CertificateGenerationForm from "components/certificates/CertificateGenerationForm";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const { data: { userProfile, userMeta } = {} } = await getClient().query(
      GET_USER_PROFILE,
      {
        userInput: {
          uid: id,
        },
      }
    );
    const user = { ...userMeta, ...userProfile };

    if (userProfile === null || userMeta === null) {
      return redirect("/404");
    }

    const {
      data: { userMeta: currentUserMeta, userProfile: currentUserProfile } = {},
    } = await getClient().query(GET_USER, { userInput: null });
    const currentUser = { ...currentUserMeta, ...currentUserProfile };

    if (currentUser.uid !== user.uid) {
      return redirect("/404");
    }

    return {
      title: `${user.firstName} ${user.lastName} Certificates`,
    };
  } catch (error) {
    return redirect("/404");
  }
}

export default async function GenerateCertificatePage({ params }) {
  const { id } = params;

  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: { uid: id },
    }
  );
  const user = { ...userMeta, ...userProfile };

  const { data: { getUserCertificates }, error } = await getClient().query(GET_USER_CERTIFICATES);
  if (error) {
    return redirect("/404");
  }

  return (
    <Grid sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Certificates
      </Typography>
      <Grid container spacing={2} sx={{ display: "flex" }}>
        <Grid item xs={12} md={2} sx={{ display: { xs: "none", md: "block" } }}>
          <UserDetails user={user} />
        </Grid>
        <Grid item xs={12} md={10}>
          <CertificateGenerationForm Certificates={getUserCertificates} />
        </Grid>
      </Grid>
    </Grid>
  );
}