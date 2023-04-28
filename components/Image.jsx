import PropTypes from "prop-types";
import NextImage from "next/image";

import { Box } from "@mui/material";

Image.propTypes = {
    ratio: PropTypes.oneOf(["4/3", "3/4", "6/4", "4/6", "16/9", "9/16", "21/9", "9/21", "1/1"]),
    sx: PropTypes.object,
};

export default function Image({ ratio, sx, ...other }) {
    if (ratio) {
        return (
            <Box
                component="span"
                sx={{
                    width: 1,
                    lineHeight: 0,
                    display: "block",
                    overflow: "hidden",
                    position: "relative",
                    pt: getRatio(ratio),
                    "& .wrapper": {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        lineHeight: 0,
                        position: "absolute",
                        backgroundSize: "cover !important",
                    },
                    ...sx,
                }}
            >
                <NextImage fill style={{ objectFit: "cover" }} {...other} />
            </Box>
        );
    }

    return (
        <Box
            component="div"
            sx={{
                lineHeight: 0,
                display: "block",
                overflow: "hidden",
                "& .wrapper": { width: 1, height: 1, backgroundSize: "cover !important" },
                ...sx,
            }}
        >
            <NextImage
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "100%" }}
                {...other}
            />
        </Box>
    );
}

function getRatio(ratio = "1/1") {
    return {
        "4/3": "calc(100% / 4 * 3)",
        "3/4": "calc(100% / 3 * 4)",
        "6/4": "calc(100% / 6 * 4)",
        "4/6": "calc(100% / 4 * 6)",
        "16/9": "calc(100% / 16 * 9)",
        "9/16": "calc(100% / 9 * 16)",
        "21/9": "calc(100% / 21 * 9)",
        "9/21": "calc(100% / 9 * 21)",
        "1/1": "100%",
    }[ratio];
}
