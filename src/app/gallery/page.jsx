import { Container, Typography } from "@mui/material";

import ImageMasonry from "components/ImageMasonry";

const FILESERVER_URL = process.env.FILESERVER_URL || "http://files";

export const metadata = {
  title: "Gallery | Life @ IIIT-H",
};

export default async function Gallery({ limit = undefined }) {
  const isHomePageWidget = typeof limit === "number";

  const response = await fetch(`${FILESERVER_URL}/files/gallery/list`, {
    cache: "no-store",
  });

  const galleryJSON = await response.json();
  const galleryItems = (galleryJSON?.gallery || []).map((item) => ({
    url: item.url,
    height: item.height,
    width: item.width,
  }));

  const masonry = (
    <ImageMasonry
      images={galleryItems}
      limit={isHomePageWidget ? limit : undefined}
    />
  );

  if (isHomePageWidget) {
    return masonry;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
        Gallery
      </Typography>
      {masonry}
    </Container>
  );
}
