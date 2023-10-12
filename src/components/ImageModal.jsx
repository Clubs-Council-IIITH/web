"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { Box, Modal } from "@mui/material";

export default function ImageModal({ images, id = null }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Modal
      open={id !== null}
      onClose={() => router.replace(pathname, undefined, { shallow: true })}
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
        <Image
          src={images[id]}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Modal>
  );
}
