// react
import { useState } from "react";

// @mui
import { Box, Card, ImageList, ImageListItem, Typography, Button } from "@mui/material";

// components
import Image from "components/Image";
import Iconify from "components/iconify";

export default function Gallery({ images }) {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <Box mt={4}>
            <Typography variant="h3" sx={{ mb: 2 }}>
                Gallery
            </Typography>
            <ImageList variant="masonry" cols={3} gap={12}>
                {/* show only 9 images if collapsed */}
                {images.slice(0, collapsed ? 9 : images.length).map((image, key) => (
                    <ImageListItem key={key}>
                        <Card>
                            <Image src={image} alt="" />
                        </Card>
                    </ImageListItem>
                ))}
            </ImageList>
            {collapsed ? (
                <Box width="100%" display="flex" justifyContent="center">
                    <Button
                        onClick={() => setCollapsed(false)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.primary",
                        }}
                    >
                        Load more
                        <Iconify icon="ic:baseline-expand-more" />
                    </Button>
                </Box>
            ) : null}
        </Box>
    );
}
