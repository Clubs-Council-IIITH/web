import { Container, Typography } from "@mui/material";

import ImageMasonry from "components/ImageMasonry";

const FILESERVER_URL = process.env.FILESERVER_URL || "http://files";

export const metadata = {
  title: "Gallery | Life @ IIIT-H",
};

async function loadGalleryItems() {
  try {
    const response = await fetch(`${FILESERVER_URL}/files/gallery/list`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const galleryJSON = await response.json();
    return (galleryJSON?.gallery || []).map((item) => ({
      url: item.url,
      height: item.height,
      width: item.width,
    }));
  } catch (err) {
    console.error("Error fetching gallery images:", err);
    return [];
  }
}

export default async function Gallery({ limit = undefined }) {
  const isHomePageWidget = typeof limit === "number";
  const galleryItems = await loadGalleryItems();

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
