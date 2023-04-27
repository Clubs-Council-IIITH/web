import PropTypes from "prop-types";
import { forwardRef } from "react";

import Iconify from "components/iconify";

const NavIcon = forwardRef(({ src, sx, ...other }, ref) => (
    <Iconify ref={ref} icon={src} sx={{ ...sx }} {...other} />
));

NavIcon.propTypes = {
    src: PropTypes.string,
    sx: PropTypes.object,
};

export default NavIcon;
