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

import Icon from "components/Icon";
import { getFile } from "utils/files";

export default function DocItem({ file, onClose, open }) {
  const handleDownload = () => {
    const fileUrl = getFile(file.url, true, true);
    window.open(fileUrl, "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>{file.title}</div>
        <Box sx={{ display: "flex", gap: 2 }}>
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
          src={getFile(file.url, true, true)}
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
