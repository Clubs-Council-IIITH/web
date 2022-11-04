import { useState, useEffect } from "react";

// @mui
import { styled } from "@mui/material/styles";

const StyledEventImg = styled("img")({
    top: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
});

export default function EventPoster({ event }) {
    const { club, name, poster } = event;

    // blur club cover and set as poster if not uploaded
    const [clubCoverAsPoster, setClubCoverAsPoster] = useState(false);
    useEffect(() => {
        if (poster === null || poster === "") {
            setClubCoverAsPoster(true);
        }
    }, [poster]);

    return (
        <StyledEventImg
            alt={name}
            src={clubCoverAsPoster ? club.img : poster}
            sx={{
                ...(clubCoverAsPoster ? { filter: "blur(0.3em)" } : {}),
            }}
        />
    );
}
