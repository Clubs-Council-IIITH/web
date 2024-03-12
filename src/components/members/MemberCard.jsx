import Link from "next/link";

import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";

import { Card, Box, Typography, CardActionArea } from "@mui/material";

import Icon from "components/Icon";
import UserImage from "components/users/UserImage";

export default async function MemberCard({ uid, poc, roles }) {
  const { data: { userProfile, userMeta } = {} } = await getClient().query(
    GET_USER_PROFILE,
    {
      userInput: {
        uid: uid,
      },
    },
  );
  const user = { ...userMeta, ...userProfile };

  return (
    <Card
      variant="outlined"
      raised={false}
      sx={{ backgroundColor: "inherit", border: "none", boxShadow: 0 }}
    >
      <CardActionArea
        // disabled // TODO: Link to public user profile
        component={Link}
        href={`/profile/${uid}`}
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

        {roles?.map((role, key) => (
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
