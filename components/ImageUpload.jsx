import { useState, useEffect } from "react";

import { useDropzone } from "react-dropzone";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

import Image from "components/Image";
import { downloadFile } from "utils/files";
import { fileConstants, MB } from "constants/files";

export default function ImageUpload({
  file,
  helpText = null,
  error = false,
  shape = "rectangle",
  ...rest
}) {
  const theme = useTheme();

  // set border radius and padding based on shape
  const [borderRadius, setBorderRadius] = useState(1);
  const [padding, setPadding] = useState("auto");
  useEffect(() => {
    if (shape === "rectangle") {
      setBorderRadius(1);
      setPadding("auto");
    } else if (shape === "circle") {
      setBorderRadius("50%");
      setPadding("25%");
    }
  }, [shape]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    maxSize: fileConstants.maxSize,
    ...rest,
  });

  return (
    <Box w={100}>
      <Box
        {...getRootProps()}
        sx={{
          padding: "10%",
          paddingTop: padding,
          paddingBottom: padding,
          outline: "none",
          overflow: "hidden",
          position: "relative",
          borderRadius: borderRadius,
          transition: theme.transitions.create("padding"),
          border: `1px dashed ${theme.palette.grey[500_32]}`,
          "&:hover": { opacity: 0.7, cursor: "pointer" },
          ...(isDragActive && { opacity: 0.7 }),
          ...((isDragReject || error || fileRejections.length) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
        }}
      >
        <input {...getInputProps()} />

        <Box sx={{ p: 3 }}>
          <Typography gutterBottom variant="h5">
            Select (or drop) file
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Drag-and-drop file here or click to browse local files.
          </Typography>
        </Box>

        {file ? (
          <Image
            alt="Upload Preview"
            src={typeof file === "string" ? downloadFile(file) : file?.preview}
            sx={{
              top: 4,
              left: 4,
              borderRadius: borderRadius,
              position: "absolute",
              width: "calc(100% - 8px)",
              height: "calc(100% - 8px)",
            }}
          />
        ) : null}
      </Box>

      {helpText && helpText}
      {fileRejections.length ? (
        <Typography variant="caption" color="error">
          File is too large! Maximum allowed size: {fileConstants.maxSize / MB} MB
        </Typography>
      ) : null}
    </Box>
  );
}
