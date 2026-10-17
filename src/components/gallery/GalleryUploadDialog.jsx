"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import FileUpload from "components/FileUpload";
import Icon from "components/Icon";
import { useToast } from "components/Toast";

import {
  uploadCarouselImageAction,
  uploadGalleryImageAction,
} from "actions/gallery/server_action";

/**
 * Validates an image File in browser using HTML Image object.
 */
function inspectImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const res = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: Number((img.naturalWidth / img.naturalHeight).toFixed(3)),
      };
      URL.revokeObjectURL(url);
      resolve(res);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for validation."));
    };
    img.src = url;
  });
}

export default function GalleryUploadDialog({
  open,
  onClose,
  target = "gallery", // "gallery" | "carousel"
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const { triggerToast } = useToast();

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({
    defaultValues: {
      file: [],
      title: "",
      description: "",
    },
  });

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  const onSubmit = async (data) => {
    const files = data.file;
    if (!files || !files.length) {
      triggerToast({
        title: "No Image Selected",
        messages: ["Please select an image to upload."],
        severity: "error",
      });
      return;
    }

    const file = files[0];

    const maxBytes = target === "gallery" ? 800 * 1024 : 2 * 1024 * 1024;
    const limitLabel = target === "gallery" ? "800 KB" : "2 MB";
    if (file.size > maxBytes) {
      const sizeLabel =
        target === "gallery"
          ? `${(file.size / 1024).toFixed(0)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      triggerToast({
        title: "File Too Large",
        messages: [`Image size (${sizeLabel}) exceeds ${limitLabel} limit.`],
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { width, height, aspectRatio } = await inspectImage(file);

      if (target === "gallery") {
        if (width < 600 || height < 800) {
          triggerToast({
            title: "Resolution Too Small",
            messages: [`Image is ${width}x${height}px. Minimum resolution for gallery images is 600x800px.`],
            severity: "error",
          });
          setLoading(false);
          return;
        }

        if (aspectRatio < 0.55 || aspectRatio > 1.15) {
          triggerToast({
            title: "Invalid Aspect Ratio",
            messages: [
              `Aspect ratio is ${aspectRatio}. Gallery requires portrait or near-square images (ratio between 0.55 and 1.15).`,
            ],
            severity: "error",
          });
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadGalleryImageAction(formData);
        if (res.ok) {
          triggerToast({
            title: "Upload Successful!",
            messages: ["Gallery image has been uploaded."],
            severity: "success",
          });
          reset();
          onSuccess(res.data);
          onClose();
        } else {
          triggerToast({
            title: res.error?.title || "Upload Failed",
            messages: res.error?.messages || ["Failed to upload gallery image."],
            severity: "error",
          });
        }
      } else {
        // Carousel validation
        if (width < 1000) {
          triggerToast({
            title: "Resolution Too Small",
            messages: [`Image width is ${width}px. Minimum width for carousel banners is 1000px.`],
            severity: "error",
          });
          setLoading(false);
          return;
        }

        if (aspectRatio < 1.5 || aspectRatio > 3.0) {
          triggerToast({
            title: "Invalid Aspect Ratio",
            messages: [
              `Aspect ratio is ${aspectRatio}. Carousel banners require landscape format (ratio between 1.5 and 3.0).`,
            ],
            severity: "error",
          });
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", data.title || "");
        formData.append("description", data.description || "");

        const res = await uploadCarouselImageAction(formData);
        if (res.ok) {
          triggerToast({
            title: "Upload Successful!",
            messages: ["Carousel banner has been uploaded."],
            severity: "success",
          });
          reset();
          onSuccess(res.data?.item);
          onClose();
        } else {
          triggerToast({
            title: res.error?.title || "Upload Failed",
            messages: res.error?.messages || ["Failed to upload carousel banner."],
            severity: "error",
          });
        }
      }
    } catch (err) {
      triggerToast({
        title: "Processing Error",
        messages: [err.message || "An unexpected error occurred while preparing the image."],
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {target === "gallery"
          ? "Upload Gallery Image"
          : "Upload Carousel Banner"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              {target === "gallery"
                ? "Upload a portrait-oriented or near-square photo for the site gallery (ratio: 0.55 - 1.15, max 800 KB, min 600x800)."
                : "Upload a landscape banner image for the home page carousel (ratio: 1.5 - 3.0, max 2 MB, min width 1000px)."}
            </Typography>

            <FileUpload
              name="file"
              control={control}
              label={target === "gallery" ? "Gallery Photo" : "Banner Photo"}
              type="image"
              maxFiles={1}
              maxSizeMB={target === "gallery" ? 800 / 1024 : 2}
              shape={target === "gallery" ? "portrait" : "banner"}
            />

            {target === "carousel" && (
              <>
                <TextField
                  label="Title"
                  placeholder="e.g. Clubs at IIIT"
                  fullWidth
                  {...register("title", { required: "Title is required" })}
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
                <TextField
                  label="Description"
                  placeholder="e.g. Explore your student life beyond the classroom."
                  fullWidth
                  multiline
                  rows={2}
                  {...register("description")}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : <Icon variant="upload" />
            }
          >
            {loading ? "Uploading..." : "Upload Image"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
