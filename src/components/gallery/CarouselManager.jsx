"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import ConfirmDialog from "components/ConfirmDialog";
import GalleryUploadDialog from "components/gallery/GalleryUploadDialog";
import Icon from "components/Icon";
import { useToast } from "components/Toast";

import {
  deleteCarouselItemAction,
  updateCarouselItemsAction,
} from "actions/gallery/server_action";

export default function CarouselManager({ initialItems = [] }) {
  const { triggerToast } = useToast();

  const [items, setItems] = useState(initialItems);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleUploadSuccess = (newItem) => {
    if (newItem) {
      setItems((prev) => [...prev, newItem]);
      setDirty(false);
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // re-normalize order indices
    const updated = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setItems(updated);
    setDirty(true);
  };

  const handleChangeText = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
    setDirty(true);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await updateCarouselItemsAction(items);
      if (res.ok) {
        triggerToast({
          title: "Changes Saved",
          messages: ["Carousel ordering and details have been saved."],
          severity: "success",
        });
        setDirty(false);
      } else {
        triggerToast({
          title: res.error?.title || "Save Failed",
          messages: res.error?.messages || ["Failed to save carousel items."],
          severity: "error",
        });
      }
    } catch (err) {
      triggerToast({
        title: "Save Error",
        messages: [err.message],
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await deleteCarouselItemAction(
        itemToDelete.id,
        itemToDelete.filename,
      );
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        triggerToast({
          title: "Banner Deleted",
          messages: ["Carousel banner has been deleted."],
          severity: "success",
        });
        setItemToDelete(null);
      } else {
        triggerToast({
          title: res.error?.title || "Delete Failed",
          messages: res.error?.messages || ["Failed to delete carousel banner."],
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
          <Typography variant="h5">Home Page Carousel</Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} banners in hero rotation. Reorder and edit titles below.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          {dirty && (
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveAll}
              disabled={saving}
              startIcon={
                saving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Icon variant="save" />
                )
              }
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<Icon variant="add" />}
            onClick={() => setUploadOpen(true)}
          >
            Add Banner
          </Button>
        </Stack>
      </Stack>

      {items.length === 0 ? (
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
            No carousel banners found
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
            Add landscape banners (under 2 MB, ratio: 1.5 - 3.0) with titles and descriptions.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Icon variant="add" />}
            onClick={() => setUploadOpen(true)}
          >
            Add First Banner
          </Button>
        </Card>
      ) : (
        <Stack spacing={2}>
          {items.map((item, idx) => (
            <Card
              key={item.id || idx}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: "background.paper",
                boxShadow: (theme) => `0px 2px 4px ${theme.palette.divider}`,
              }}
            >
              <Grid container spacing={2.5} alignItems="center">
                {/* Reorder arrows and order number */}
                <Grid item xs={12} sm="auto">
                  <Stack
                    direction={{ xs: "row", sm: "column" }}
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.5}
                  >
                    <Tooltip title="Move Up">
                      <span>
                        <IconButton
                          size="small"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, -1)}
                        >
                          <Icon variant="arrow-upward" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: "bold", minWidth: 24, textAlign: "center" }}
                    >
                      #{idx + 1}
                    </Typography>

                    <Tooltip title="Move Down">
                      <span>
                        <IconButton
                          size="small"
                          disabled={idx === items.length - 1}
                          onClick={() => handleMove(idx, 1)}
                        >
                          <Icon variant="arrow-downward" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Grid>

                {/* Banner Thumbnail */}
                <Grid item xs={12} sm={4} md={3}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "2.5 / 1",
                      borderRadius: 1,
                      overflow: "hidden",
                      bgcolor: "grey.900",
                    }}
                  >
                    <Image
                      src={item.url}
                      alt={item.title || "Banner"}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 900px) 100vw, 300px"
                    />
                  </Box>
                </Grid>

                {/* Editable Title & Description */}
                <Grid item xs={12} sm={6} md={7}>
                  <Stack spacing={1.5}>
                    <TextField
                      label="Banner Title"
                      size="small"
                      fullWidth
                      value={item.title || ""}
                      onChange={(e) =>
                        handleChangeText(item.id, "title", e.target.value)
                      }
                    />
                    <TextField
                      label="Banner Description"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      value={item.description || ""}
                      onChange={(e) =>
                        handleChangeText(item.id, "description", e.target.value)
                      }
                    />
                  </Stack>
                </Grid>

                {/* Delete button */}
                <Grid item xs={12} sm="auto" sx={{ textAlign: "right" }}>
                  <Tooltip title="Delete Banner">
                    <IconButton
                      color="error"
                      onClick={() => setItemToDelete(item)}
                    >
                      <Icon variant="delete-outline-rounded" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Stack>
      )}

      {/* Upload Dialog */}
      <GalleryUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        target="carousel"
        onSuccess={handleUploadSuccess}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title="Delete Carousel Banner"
        description={`Are you sure you want to delete the carousel banner "${itemToDelete?.title || itemToDelete?.filename}"?`}
        confirmText={deleting ? "Deleting..." : "Delete Banner"}
        confirmProps={{
          color: "error",
          variant: "contained",
          disabled: deleting,
          startIcon: deleting ? <CircularProgress size={16} color="inherit" /> : null,
        }}
        onConfirm={handleDeleteConfirm}
        onClose={() => !deleting && setItemToDelete(null)}
      />
    </Box>
  );
}
