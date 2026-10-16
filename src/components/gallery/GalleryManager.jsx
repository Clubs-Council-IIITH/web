"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ConfirmDialog from "components/ConfirmDialog";
import GalleryUploadDialog from "components/gallery/GalleryUploadDialog";
import Icon from "components/Icon";
import { useToast } from "components/Toast";

import { deleteGalleryImageAction } from "actions/gallery/server_action";

export default function GalleryManager({ initialImages = [] }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { triggerToast } = useToast();

  const [images, setImages] = useState(initialImages);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleUploadSuccess = (newItem) => {
    if (newItem) {
      setImages((prev) => [newItem, ...prev]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    setDeleting(true);
    try {
      const res = await deleteGalleryImageAction(imageToDelete.filename);
      if (res.ok) {
        setImages((prev) =>
          prev.filter((img) => img.filename !== imageToDelete.filename),
        );
        triggerToast({
          title: "Image Deleted",
          messages: ["The gallery image has been deleted."],
          severity: "success",
        });
        setImageToDelete(null);
      } else {
        triggerToast({
          title: res.error?.title || "Delete Failed",
          messages: res.error?.messages || ["Failed to delete image."],
          severity: "error",
        });
      }
    } catch (err) {
      triggerToast({
        title: "Delete Error",
        messages: [err.message],
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5">Gallery Photos</Typography>
          <Typography variant="body2" color="text.secondary">
            {images.length} portrait & square images in the site gallery
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Icon variant="add" />}
          onClick={() => setUploadOpen(true)}
        >
          Upload Photo
        </Button>
      </Stack>

      {images.length === 0 ? (
        <Card
          variant="outlined"
          sx={{
            p: 6,
            textAlign: "center",
            borderStyle: "dashed",
            bgcolor: "background.neutral",
          }}
        >
          <Typography variant="h6" gutterBottom color="text.secondary">
            No gallery images found
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
            Upload portrait or near-square photos (under 1.5 MB) to display in the site gallery.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Icon variant="add" />}
            onClick={() => setUploadOpen(true)}
          >
            Upload First Photo
          </Button>
        </Card>
      ) : (
        <ImageList variant="masonry" cols={isDesktop ? 4 : 2} gap={16}>
          {images.map((item, idx) => (
            <ImageListItem key={item.filename || idx}>
              <Card
                variant="outlined"
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 1.5,
                  boxShadow: `0px 4px 8px ${theme.palette.primary.dark}40`,
                  "&:hover .delete-overlay": {
                    opacity: 1,
                  },
                }}
              >
                <Image
                  src={item.url}
                  alt={item.filename || `Gallery image ${idx}`}
                  width={item.width || 800}
                  height={item.height || 1000}
                  unoptimized
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                  sizes="(max-width: 900px) 50vw, 25vw"
                />

                {/* Delete button overlay */}
                <Box
                  className="delete-overlay"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    opacity: { xs: 1, sm: 0 },
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Tooltip title="Delete Image">
                    <IconButton
                      size="small"
                      onClick={() => setImageToDelete(item)}
                      sx={{
                        bgcolor: "rgba(0, 0, 0, 0.65)",
                        color: "error.light",
                        "&:hover": {
                          bgcolor: "error.main",
                          color: "white",
                        },
                      }}
                    >
                      <Icon variant="delete-outline-rounded" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Dimensions badge at bottom */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 6,
                    left: 6,
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    px: 0.8,
                    py: 0.2,
                    borderRadius: 0.8,
                    fontSize: "0.7rem",
                    pointerEvents: "none",
                  }}
                >
                  {item.width && item.height
                    ? `${item.width}×${item.height}`
                    : item.filename}
                </Box>
              </Card>
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* Upload Dialog */}
      <GalleryUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        target="gallery"
        onSuccess={handleUploadSuccess}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(imageToDelete)}
        title="Delete Gallery Image"
        description={`Are you sure you want to permanently delete this photo (${imageToDelete?.filename})? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete Image"}
        confirmProps={{
          color: "error",
          variant: "contained",
          disabled: deleting,
          startIcon: deleting ? <CircularProgress size={16} color="inherit" /> : null,
        }}
        onConfirm={handleDeleteConfirm}
        onClose={() => !deleting && setImageToDelete(null)}
      />
    </Box>
  );
}
