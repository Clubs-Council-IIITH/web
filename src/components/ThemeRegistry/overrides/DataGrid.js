"use client";

export default function DataGrid(theme) {
  const isDark = theme.palette.mode === "dark";

  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell--editing": {
            backgroundColor: isDark
              ? theme.palette.grey[800]
              : theme.palette.background.paper,
            color: theme.palette.text.primary,
            "& .MuiInputBase-root": {
              height: "100%",
              color: theme.palette.text.primary,
            },
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
            },
            "& input": {
              color: theme.palette.text.primary,
              caretColor: theme.palette.text.primary,
            },
          },
          "& .MuiDataGrid-editInputCell": {
            color: theme.palette.text.primary,
            "& input": {
              color: theme.palette.text.primary,
              caretColor: theme.palette.text.primary,
              padding: "0 10px",
            },
          },
          "& .MuiDataGrid-editLongTextCellValue": {
            color: theme.palette.text.primary,
          },
          "& .MuiDataGrid-editLongTextCellPopper, & .MuiDataGrid-editLongTextCellPopup": {
            backgroundColor: isDark
              ? theme.palette.grey[800]
              : theme.palette.background.paper,
          },
          "& .MuiDataGrid-editLongTextCellPopperContent": {
            backgroundColor: isDark
              ? theme.palette.grey[800]
              : theme.palette.background.paper,
            color: theme.palette.text.primary,
            "& textarea": {
              color: `${theme.palette.text.primary} !important`,
              caretColor: `${theme.palette.text.primary} !important`,
            },
          },
        },
      },
    },
  };
}
