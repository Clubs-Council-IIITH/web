import Link from "next/link";

import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Card, Box, Typography, CardActionArea } from "@mui/material";

import Icon from "components/Icon";
import UserImage from "components/users/UserImage";
import { getUserNameFromUID } from "utils/users";

export default async function MemberCard({ uid, poc, roles }) {
  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: {
        uid: uid,
      },
    },
  );

  if (userMeta === null) {
    return null;
  }

  let user = { ...userMeta, ...userProfile };
  if (userProfile === null) {
    const name = getUserNameFromUID(uid);
    const userProfile1 = {
      firstName: name.firstName,
      lastName: name.lastName,
      email: null,
      gender: null,
    };
    user = { ...userMeta, ...userProfile1 };
  }

  // Edge case for profile redirecting 404 for faculty/staff in supervisory-bodies section
  const clickable =
    user?.role !== "public" ||
    user?.email?.includes("student") ||
    user?.email?.includes("research");

  return (
    <Card
      variant="outlined"
      raised={false}
      sx={{ backgroundColor: "inherit", border: "none", boxShadow: 0 }}
    >
      <CardActionArea
        component={clickable ? Link : "div"}
        href={`/profile/${uid}`}
        disabled={userProfile === null}
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <UserImage
          image={user.img}
          name={user.firstName}
          gender={user.gender}
          width={150}
          height={150}
        />
        <Typography
          textAlign="center"
          variant="subtitle1"
          textTransform="capitalize"
          mt={3}
        >
          {`${user.firstName} ${user.lastName}`.toLowerCase()}
        </Typography>

        {poc ? (
          <Box display="flex" alignItems="center" mt={1}>
            <Icon
              variant="contact-emergency-rounded"
              color="error.main"
              mr={1}
            />
            <Typography variant="subtitle2" fontWeight={400}>
              Point of Contact
            </Typography>
          </Box>
        ) : null}

        {roles
          ?.sort((a, b) => {
            // Place roles with endYear=null at the top
            if (a.endYear === null && b.endYear !== null) {
              return -1;
            } else if (a.endYear !== null && b.endYear === null) {
              return 1;
            } else {
              // Sort based on endYear in descending order
              return b.endYear - a.endYear;
            }
          })
          .map((role, key) => (
            <Box key={key} mt={0.5} textAlign="center">
              <Typography
                variant="body2"
                sx={{ display: "inline-block", color: "text.secondary" }}
              >
                {role.name}
              </Typography>
              <Typography
                variant="body2"
                color="grey.400"
                sx={{
                  display: "inline-block",
                }}
                ml={0.5}
              >
                ({role.startYear} - {role.endYear || "present"})
              </Typography>
            </Box>
          ))}
      </CardActionArea>
    </Card>
  );
}
