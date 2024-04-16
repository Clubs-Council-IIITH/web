import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_USER_PROFILE } from "gql/queries/users";
import { HAVE_APPLIED } from "gql/queries/recruitment";

import RecruitmentForm from "components/cc-recruitments/RecruitmentForm";

import { Container, Typography } from "@mui/material";

export const metadata = {
  title: "New Application",
};

const deadline = new Date("2024-04-17T06:00:00+05:30");

async function getUser(currentUser) {
  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: {
        uid: currentUser.uid,
      },
    },
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
    { userInput: null },
  );
  const user = await getUser(await currentUser);

  return (
    <Container>
      {haveAppliedForCC ? (
        <>
          <Typography variant="h5" gutterBottom mt={6} align="center">
            You have already applied for Clubs Council Position. Thank you!
          </Typography>
          <Typography variant="h6" gutterBottom mt={3} align="center">
            You will be notified about the next stages of the process shortly.
          </Typography>
        </>
      ) : new Date() > deadline ? (
        <Typography variant="h4" gutterBottom mt={3} align="center">
          This form is disabled now. <br /> <br />
          The deadline for the form submission was <br />
          {deadline.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </Typography>
      ) : (
        <>
          <Typography variant="h3" gutterBottom mb={3} align="center">
            Apply for Clubs Council
          </Typography>

          <Typography variant="h5" gutterBottom mb={3}>
            Instructions
          </Typography>

          <ul>
            <li>
              The deadline for the form is{" "}
              {deadline.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </li>
            <li>
              Only the following batches are allowed to apply for Clubs Council
              position this year:
              <ul>
                <li>UG 2k22</li>
                <li>UG 2k23</li>
                <li>PG 2k23</li>
              </ul>
            </li>
            <li>
              Form once submitted cannot be edited. Please fill the form
              carefully.
            </li>
          </ul>

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
