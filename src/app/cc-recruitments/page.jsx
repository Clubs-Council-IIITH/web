// The main form goes here with the form fields and the submit button.
// When the person submits the phone number, update the same in his/her profile as well - check the edit phone number API from the events POC thing

// At the top needs to be the title of the page
// Then comes few instructions for the user
// Add deadline for the form submission as some date, after which the form will be disabled - and show a message that the form is disabled

import RecruitmentForm from "components/cc-recruitments/RecruitmentForm";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_USER_PROFILE } from "gql/queries/users";
import { HAVE_APPLIED } from "gql/queries/recruitment";
import { Container, Typography } from "@mui/material";

export const metadata = {
  title: "New Application",
};

const deadline = new Date("2024-04-10T11:59:00Z");

async function getUser(currentUser) {
  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: {
        uid: currentUser.uid,
      },
    }
  );
  const user = { ...userMeta, ...userProfile };
  return user;
}

export default async function NewApplication() {
  const {
    data: { userMeta: currentUserMeta, userProfile: currentUserProfile } = {},
  } = await getClient().query(GET_USER, { userInput: null });
  const currentUser = { ...currentUserMeta, ...currentUserProfile };

  const { data: { haveAppliedForCC } = {} } = await getClient().query(
    HAVE_APPLIED,
    { userInput: null }
  );
  const user = await getUser(await currentUser);

  return (
    <Container>
      {new Date() > deadline ? (
        <Typography variant="h4" gutterBottom mt={3} align="center">
          The form is disabled
        </Typography>
      ) : haveAppliedForCC ? (
        <>
          <Typography variant="h5" gutterBottom mt={6} align="center">
            You have already applied for Clubs Council Position. Thank you!
          </Typography>
          <Typography variant="h6" gutterBottom mt={3} align="center">
            You will be notified about the further stages soon.
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h3" gutterBottom mb={3} align="center">
            Apply for Clubs Council
          </Typography>

          <Typography variant="h5" gutterBottom mb={3}>
            Instructions
          </Typography>

          <Typography variant="body1" gutterBottom mb={3}>
            Add deadline for the form submission as some date, after which the
            form will be disabled - and show a message that the form is disabled
          </Typography>

          <Typography variant="h5" gutterBottom mb={3}>
            Application Form
          </Typography>

          <RecruitmentForm user={user} />
        </>
      )}

      <Typography variant="body2" gutterBottom mt={10} align="center">
        Made with ❤️ by the SLC Tech Team. For any queries contact us at{" "}
        <a href="mailto:clubs@iiit.ac.in"> clubs@iiit.ac.in </a>
      </Typography>
    </Container>
  );
}
