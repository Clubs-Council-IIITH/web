import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Card, Box, Typography, CardActionArea } from "@mui/material";

import Icon from "components/Icon";
import UserImage from "components/users/UserImage";

export default async function MemberCard({ uid, poc, roles }) {
  const { data: { userProfile, userMeta } = {} } = await getClient().query({
    query: GET_USER_PROFILE,
    skip: !uid,
    variables: {
      userInput: {
        uid: uid,
      },
    },
  });

  return (
    <Card
      variant="outlined"
      raised={false}
      sx={{ backgroundColor: "inherit", border: "none", boxShadow: 0 }}
    >
      <CardActionArea
        disabled // TODO: Link to public user profile
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <UserImage
          image={userMeta.img}
          name={userProfile.firstName}
          gender={userProfile.gender}
          width={128}
          height={128}
        />
        <Typography variant="subtitle1" textTransform="capitalize" mt={3}>
          {`${userProfile.firstName} ${userProfile.lastName}`.toLowerCase()}
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

        {roles?.map((role, key) => (
          <Box key={key} mt={0.5}>
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
