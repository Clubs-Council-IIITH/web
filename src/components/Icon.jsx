"use client";

import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Icon as Iconify } from "@iconify/react";
import { Box } from "@mui/material";

const Icon = forwardRef(
  ({ variant, external = false, width = 20, sx, ...other }, ref) => (
    <Box
      icon={external ? variant : `material-symbols:${variant}`}
      ref={ref}
      component={Iconify}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  )
);

Icon.displayName = "Icon";
Icon.propTypes = {
  sx: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default Icon;
