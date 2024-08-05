import { redirect } from "next/navigation";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_USER_PROFILE } from "gql/queries/users";
import { GET_USER_CERTIFICATES } from "gql/queries/members";

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
    <Container>
      <Typography variant="h4" gutterBottom>
        Certificates
      </Typography>
      <Card>
        <CardHeader
          title="User Details"
          titleTypographyProps={{ variant: "h5" }}
        />
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Typography>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Roll Number:</strong> {user.rollno}
            </Typography>
            <Typography>
              <strong>Batch:</strong> {user.batch.toUpperCase()} ·{" "}
              {user.stream.toUpperCase()}
            </Typography>
          </div>
        </CardContent>
      </Card>

      <CertificateGenerationForm userCertificates={getUserCertificates} />
    </Container>
  );
}
