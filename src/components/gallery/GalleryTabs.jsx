"use client";

import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import CarouselManager from "components/gallery/CarouselManager";
import GalleryManager from "components/gallery/GalleryManager";
import Icon from "components/Icon";

export default function GalleryTabs({ galleryItems = [], carouselItems = [] }) {
  const [tab, setTab] = useState(0);
  const [galleryCount, setGalleryCount] = useState(galleryItems.length);
  const [carouselCount, setCarouselCount] = useState(carouselItems.length);

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, newTab) => setTab(newTab)}
          aria-label="Gallery and Carousel tabs"
        >
          <Tab
            icon={<Icon variant="photo-library-outline-rounded" />}
            iconPosition="start"
            label={`Gallery Photos (${galleryCount})`}
          />
          <Tab
            icon={<Icon variant="view-carousel-outline-rounded" />}
            iconPosition="start"
            label={`Carousel Banners (${carouselCount})`}
          />
        </Tabs>
      </Box>

      <Box sx={{ display: tab === 0 ? "block" : "none" }}>
        <GalleryManager
          initialImages={galleryItems}
          onCountChange={setGalleryCount}
        />
      </Box>
      <Box sx={{ display: tab === 1 ? "block" : "none" }}>
        <CarouselManager
          initialItems={carouselItems}
          onCountChange={setCarouselCount}
        />
      </Box>
    </Box>
  );
}
