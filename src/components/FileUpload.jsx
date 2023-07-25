"use client";

import Image from "next/image";

import { useMemo } from "react";

import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Controller } from "react-hook-form";

import { useDropzone } from "react-dropzone";
import { getFile } from "utils/files";

export default function FileUpload({
  control,
  label,
  name,
  type = "image",
  maxFiles = 0,
}) {
  return (
    <>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DropZone
            files={value}
            onDrop={onChange}
            type={type}
            maxFiles={maxFiles}
          />
        )}
      />
    </>
  );
}

function DropZone({ files, onDrop, type, maxFiles }) {
  const theme = useTheme();

  // accept only valid extensions
  const accept = useMemo(() => {
    switch (type) {
      case "image":
        return { "image/*": [".jpg", ".jpeg", ".png"] };
      case "document":
        return { "application/pdf": [".pdf"] };
      default:
        return { "*": [] };
    }
  }, [type]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        padding: "10%",
        outline: "none",
        overflow: "hidden",
        position: "relative",
        borderRadius: 1,
        transition: theme.transitions.create("padding"),
        border: `1px dashed ${theme.palette.grey[500_32]}`,
        "&:hover": { opacity: 0.7, cursor: "pointer" },
        ...(isDragActive && { opacity: 0.7 }),
        ...((isDragReject || fileRejections.length) && {
          color: "error.main",
          borderColor: "error.light",
          bgcolor: "error.lighter",
        }),
      }}
    >
      <input {...getInputProps()} />

      <Box p={3}>
        <Typography gutterBottom variant="h5">
          Select (or drop) file
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Drag-and-drop file here or click to browse local files.
        </Typography>
      </Box>

      {files?.length ? (
        type === "image" && maxFiles === 1 ? (
          <Image
            alt="Upload preview"
            src={
              typeof files[0] === "string"
                ? getFile(files[0])
                : URL.createObjectURL(files[0])
            }
            width={100}
            height={100}
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          />
        ) : (
          files.map((file) => <Chip label={file.name} sx={{ m: 0.5 }} />)
        )
      ) : null}
    </Box>
  );
}
