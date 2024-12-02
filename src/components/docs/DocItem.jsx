'use client';

import { useState } from "react";

import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Grid,
} from '@mui/material';
import Icon from 'components/Icon';

import { getFile } from 'utils/files'

export default function DocItem({ file, onClose, open }) {
  const [loading, setLoading] = useState(true);

  const handleDownload = () => {
    const fileUrl = getFile(file.url);
    window.open(fileUrl, '_blank');
  };

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>{file.title}</div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Icon variant="download" />}
            onClick={handleDownload}
            size="small"
          >
            Download
          </Button>
          <IconButton
            onClick={onClose}
            size="small"
          >
            <Icon variant="close" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        { loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="90vh"
            mt={3}
          >
            <CircularProgress />
          </Box>
        ): null }
        <iframe
          src={getFile(file.url)}
          style={{
            width: '100%',
            height: '80vh',
            border: 'none',
          }}
          title={file.title}
          onLoad={handleIframeLoad}
        />
      </DialogContent>
    </Dialog>
  );
}
