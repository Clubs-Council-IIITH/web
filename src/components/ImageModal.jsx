"use client";

import Image from "next/image";

import { Box, Modal } from "@mui/material";

export default function ImageModal({ images, id = null, onClose = () => {} }) {
  return (
    <Modal
      open={id !== null}
      onClose={() => onClose()}
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        component="div"
        sx={{
          lineHeight: 0,
          display: "block",
          overflow: "hidden",
          "& .wrapper": {
            width: 1,
            height: 1,
            backgroundSize: "cover !important",
          },
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {id !== null && images?.[id] ? (
          <Image
            src={images[id].url}
            width={images[id].width || 1200}
            height={images[id].height || 800}
            sizes="100vw"
            alt={`Gallery Image ${id}`}
            unoptimized={typeof images[id].url === "string"}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100vh",
              maxWidth: "100vw",
            }}
          />
        ) : null}
      </Box>
    </Modal>
  );
}
