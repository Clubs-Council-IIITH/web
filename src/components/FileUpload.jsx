"use client";

import Image from "next/image";

import { useMemo } from "react";

import { Chip, Box, Typography, FormHelperText } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Controller } from "react-hook-form";

import { useDropzone, ErrorCode } from "react-dropzone";
import { getFile } from "utils/files";

export default function FileUpload({
  control,
  label,
  name,
  type = "image",
  maxFiles = 0,
  maxSize = 20 * 1024 * 1024, // 20MB
  shape = "",
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
            maxSize={maxSize}
            shape={shape}
          />
        )}
      />
    </>
  );
}

function getIsTypeofFileRejected(fileRejections, type) {
  // console.log(
  //   fileRejections.some(({ errors }) =>
  //     errors.some((error) => error.code == type),
  //   ),
  // );
  return fileRejections.some(({ errors }) =>
    errors.some((error) => error.code == type),
  );
}

function DropZone({ files, onDrop, type, maxFiles, maxSize, shape }) {
  const theme = useTheme();

  // accept only valid extensions
  const accept = useMemo(() => {
    switch (type) {
      case "image":
        return {
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"],
        };
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
    onDropAccepted: onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: maxFiles > 1,
  });

  return (
    <>
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
                typeof files === "string"
                  ? getFile(files)
                  : Array.isArray(files)
                    ? typeof files[0] === "string"
                      ? getFile(files[0])
                      : URL.createObjectURL(files[0])
                    : null
              }
              width={800}
              height={800}
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
      <FormHelperText
        error={getIsTypeofFileRejected(fileRejections, ErrorCode.TooManyFiles)}
      >
        Allowed file count: {maxFiles}
      </FormHelperText>
      <FormHelperText
        error={getIsTypeofFileRejected(fileRejections, ErrorCode.FileTooLarge)}
        sx={{ mt: 0 }}
      >
        Allowed file size: {maxSize / 1024 / 1024}MB
      </FormHelperText>
      <FormHelperText
        error={getIsTypeofFileRejected(
          fileRejections,
          ErrorCode.FileInvalidType,
        )}
        sx={{ mt: 0 }}
      >
        Allowed file types: {[].concat(...Object.values(accept)).join(" | ")}
      </FormHelperText>
      {shape == "square" ? (
        <FormHelperText sx={{ mt: 0 }}>
          Please upload a square image (1:1 aspect ratio) for optimal display.
        </FormHelperText>
      ) : shape == "circle" ? (
        <FormHelperText sx={{ mt: 0 }}>
          Please upload a circular image for optimal display.
        </FormHelperText>
      ) : shape == "rectangle" ? (
        <FormHelperText sx={{ mt: 0 }}>
          Please upload image with around 4:1 aspect ratio for optimal display.
        </FormHelperText>
      ) : null}
    </>
  );
}
