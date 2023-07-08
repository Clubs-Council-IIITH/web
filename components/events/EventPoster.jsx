import { useState, useEffect } from "react";

import { useLazyQuery } from "@apollo/client";
import { GET_CLUB } from "gql/queries/clubs";

import { styled } from "@mui/material/styles";
import { downloadFile } from "utils/files";

const StyledEventImg = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
});

export default function EventPoster({ event }) {
  const [getClub, { data: { club } = {}, loading, error }] = useLazyQuery(GET_CLUB, {
    variables: {
      clubInput: { cid: event?.clubid },
    },
  });

  // blur club cover and set as poster if not uploaded
  const [clubCoverAsPoster, setClubCoverAsPoster] = useState(false);
  useEffect(() => {
    if (event?.poster === null || event?.poster === "") {
      getClub();
      setClubCoverAsPoster(true);
    }
  }, [event?.poster]);

  return loading ? null : !event ? null : (
    <StyledEventImg
      alt={event?.name}
      src={downloadFile(clubCoverAsPoster ? club?.banner : event?.poster)}
      sx={{
        ...(clubCoverAsPoster ? { filter: "blur(0.3em)" } : {}),
      }}
    />
  );
}
