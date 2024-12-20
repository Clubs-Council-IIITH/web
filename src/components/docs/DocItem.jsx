"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";
import { getFile } from "utils/files";
import { formatDate } from "components/docs/DocsList";

const buildFileName = (file, version) => {
  return file.filename + "_v" + version.toString() + "." + file.filetype;
};

export default function DocItem({
  file,
  version,
  versionChange,
  maxVersion,
  onClose,
  open,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDownload = () => {
    const fileUrl = getFile(buildFileName(file, version), true, true);

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = buildFileName(file, version);

    // Append it to the body (necessary for some browsers)
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleVersionChange = (event) => {
    versionChange(event.target.value);
  };

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Adjust layout for mobile
          justifyContent: isMobile ? "center" : "space-between",
          alignItems: isMobile ? "center" : "center",
          position: "relative",
        }}
      >
        {/* Title */}
        <Box
          component="div"
          sx={{
            position: isMobile ? "static" : "absolute",
            left: isMobile ? "auto" : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            textAlign: "center",
          }}
        >
          {file.title}
        </Box>

        {/* Buttons and Dropdown */}
        {isMobile ? (
          // Render buttons below the title for mobile
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 2,
              mb: 2,
              width: "100%",
            }}
          >
            {/* Dropdown */}
            <Box>
              <Select
                value={version}
                onChange={handleVersionChange}
                size="small"
                sx={{ minWidth: 100, width: "100%" }}
              >
                {Array.from({ length: maxVersion }, (_, i) => {
                  const version = maxVersion - i;
                  return (
                    <MenuItem key={version} value={version}>
                      {`v${version}${
                        version === maxVersion ? " (Latest)" : ""
                      }`}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>

            {/* Download Button */}
            <Button
              variant="contained"
              startIcon={<Icon variant="download" />}
              onClick={handleDownload}
              size="small"
              sx={{ width: "100%" }}
            >
              Download
            </Button>

            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                right: 8,
              }}
            >
              <Icon variant="close" />
            </IconButton>
          </Box>
        ) : (
          // Desktop layout
          <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
            {/* Dropdown */}
            <Box>
              <Select
                value={version}
                onChange={handleVersionChange}
                size="small"
                sx={{ minWidth: 100 }}
              >
                {Array.from({ length: maxVersion }, (_, i) => {
                  const version = maxVersion - i;
                  return (
                    <MenuItem key={version} value={version}>
                      {`v${version}${
                        version === maxVersion ? " (Latest)" : ""
                      }`}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>

            {/* Download Button */}
            <Button
              variant="contained"
              startIcon={<Icon variant="download" />}
              onClick={handleDownload}
              size="small"
            >
              Download
            </Button>

            <IconButton onClick={onClose} size="small">
              <Icon variant="close" />
            </IconButton>
          </Box>
        )}
      </DialogTitle>

      <DialogContent>
        <iframe
          src={getFile(buildFileName(file, version), true, true)}
          style={{
            width: "100%",
            height: "75vh",
            border: "none",
          }}
          title={file.title}
        >
          <Typography variant="body1">
            Your device does not support previewing this file. Please download
            it to view.
          </Typography>
        </iframe>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Last Modified: {formatDate(file.modifiedTime)}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
