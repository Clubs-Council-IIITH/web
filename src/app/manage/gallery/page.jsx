import { redirect } from "next/navigation";

import { Container, Stack, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";

import GalleryTabs from "components/gallery/GalleryTabs";

const FILESERVER_URL =
  process.env.FILESERVER_URL ||
  process.env.NEXT_PUBLIC_FILESERVER_URL ||
  "http://files";

export const metadata = {
  title: "Manage Gallery & Carousel",
};

async function getGalleryData() {
  try {
    const res = await fetch(`${FILESERVER_URL}/files/gallery/list`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.gallery || []).map((item) => ({
      ...item,
      url: item.url,
    }));
  } catch (err) {
    console.error("Error fetching gallery images:", err);
    return [];
  }
}

async function getCarouselData() {
  try {
    const res = await fetch(`${FILESERVER_URL}/files/carousel/list`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.carousel || []).map((item) => ({
      ...item,
      url: item.url,
    }));
  } catch (err) {
    console.error("Error fetching carousel banners:", err);
    return [];
  }
}

export default async function ManageGallery() {
  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });
  if (!["cc", "slo"].includes(userMeta?.role)) redirect("/");

  const [galleryItems, carouselItems] = await Promise.all([
    getGalleryData(),
    getCarouselData(),
  ]);

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Manage Gallery & Carousel
        </Typography>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Update images and hero banners shown across the Clubs Council website.
      </Typography>

      <GalleryTabs galleryItems={galleryItems} carouselItems={carouselItems} />
    </Container>
  );
}
