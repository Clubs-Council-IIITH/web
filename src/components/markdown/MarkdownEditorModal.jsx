"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

// Dynamically import the MDXEditor to ensure it only loads on the client side
// and does not cause hydration errors during Server-Side Rendering (SSR).
const MDXEditorComponent = dynamic(
  () => import("./MDXEditorComponent"),
  { ssr: false }
);

export default function MarkdownEditorModal({ open, onClose, content, oldContent, onSave }) {
  const [contentState, setContentState] = useState(content);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Markdown Editor</DialogTitle>
      <DialogContent dividers sx={{ minHeight: "60vh" }}>
        {open && (
          <MDXEditorComponent
            markdown={contentState}
            onChange={setContentState}
            oldMarkdown={oldContent}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Confirm & Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
