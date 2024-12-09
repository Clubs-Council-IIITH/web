"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Typography,
} from "@mui/material";

import { useTheme  } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";
import { getFile } from "utils/files";

export default function DocItem({ file, onClose, open }) {
  const handleDownload = () => {
    const fileUrl = getFile(file.filename, true, true);
    window.open(fileUrl, "_blank");
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  return (
    <Dialog open={open} fullScreen={fullScreen} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          component="div"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          {file.title}
        </Box>

        {/* Buttons on the right */}
        <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
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
      </DialogTitle>

      <DialogContent>
        <iframe
          src={getFile(file.filename, true, true)}
          style={{
            width: "100%",
            height: "80vh",
            border: "none",
          }}
          title={file.title}
        >
          <Typography variant="body1">
            Your device does not support previewing this file. Please download
            it to view.
          </Typography>
        </iframe>
      </DialogContent>
    </Dialog>
  );
}
