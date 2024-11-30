import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LifeLogo from "components/life-logo-full-color-light.svg";

export default function Logo() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const color = theme.palette.mode === "light" ? "#803db2" : "#1ec3bd";

  return (
    <div style={{ color }}>
      <LifeLogo width={140} height={60} alt="Life Logo" />
    </div>
  );
}
