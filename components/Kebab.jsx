import { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";

import Iconify from "components/iconify";

export default function Kebab({ items }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Iconify icon={"eva:more-vertical-fill"} width={20} height={20} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {items.map((item, key) => (
          <MenuItem key={key} onClick={item.onClick}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
