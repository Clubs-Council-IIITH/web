import { useState, useEffect } from "react";

import Link from "next/link";

import { Button, Box } from "@mui/material";

import Iconify from "components/iconify";

const sites = {
    website: { icon: "mdi:web", color: "#7F7F7F" },
    facebook: { icon: "ic:baseline-facebook", color: "#3C5999" },
    instagram: { icon: "mdi:instagram", color: "#E94475" },
    twitter: { icon: "mdi:twitter", color: "#05ACED" },
    linkedin: { icon: "mdi:linkedin", color: "#027FB1" },
    discord: { icon: "ic:baseline-discord", color: "#5865F3" },
    youtube: { icon: "mdi:youtube", color: "#FF3333" },
};

export default function ClubSocial({ socials = {} }) {
    const [processedSocials, setProcessedSocials] = useState({});

    useEffect(() => {
        const processed = {};
        Object.keys(sites)
            ?.filter((k) => socials[k])
            ?.forEach((k) => {
                var content = socials[k];
                if (content.endsWith("/")) content = content.slice(0, -1); // remove trailing slash
                content = content.split("/").slice(-1)[0]; // get only the relevant part of the URL
                content = content.split("?")[0]; // remove querystring
                if (content !== "") processed[k] = content; // only add if not empty
            });
        setProcessedSocials(processed);
    }, [socials]);

    return (
        <Box>
            {Object.keys(sites)
                ?.filter((k) => socials[k])
                ?.map((item, index) => (
                    <Button
                        component={Link}
                        href={socials[item]}
                        key={index}
                        sx={{
                            mx: 1,
                            textTransform: "none",
                            color: sites[item].color,
                        }}
                    >
                        <Iconify icon={sites[item].icon} mr={1} />
                        {processedSocials[item]}
                    </Button>
                ))}
        </Box>
    );
}
