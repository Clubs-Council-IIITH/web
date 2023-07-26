"use client";

import { createContext, useContext, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Slide,
  AlertTitle,
  Snackbar,
  useMediaQuery,
} from "@mui/material";

const ToastContext = createContext({
  open: false,
  title: "",
  message: "",
  severity: "info",
  handleClose: () => null,
  triggerToast: () => null,
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    title: null,
    message: null,
    severity: null,
  });
  const handleClose = () => setToast({ ...toast, open: false });

  const triggerToast = ({ title, message, severity }) => {
    setToast({ open: true, title, message, severity });
  };

  return (
    <ToastContext.Provider
      value={{
        ...toast,
        handleClose,
        triggerToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export default function Toast() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const { open, title, message, severity, handleClose } = useToast();

  console.log(open, title, message, severity);

  return message?.length ? (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: isDesktop ? "right" : "center",
      }}
      onClose={handleClose}
      autoHideDuration={8000}
      TransitionComponent={Slide}
      sx={{
        mb: 3,
        mr: isDesktop ? 3 : 0,
      }}
    >
      <Alert variant="standard" onClose={handleClose} severity={severity}>
        <AlertTitle>{title}</AlertTitle>
        {message?.split("\n")?.map((line, key) => (
          <Box key={key}>{line}</Box>
        ))}
      </Alert>
    </Snackbar>
  ) : null;
}
