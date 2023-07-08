import { Button, CircularProgress } from "@mui/material";

export default function LoadingButton({ loading, children, ...other }) {
  return (
    <Button {...other}>{loading ? <CircularProgress color="grey" size={18} /> : children}</Button>
  );
}
