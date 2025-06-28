"use client";

import { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";
import { fCurrency } from "utils/formatCurrency";
import { validateBillno } from "components/events/bills/BillUpload";

export default function EventSponsor({
  editable = false,
  rows = [],
  setRows = console.log,
}) {
  const theme = useTheme();
  const [error, setError] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // budget item template
  const emptySponsorItem = {
    name: null,
    website: null,
    amount: 0,
    previouslySponsored: false,
  };

  // data manipulation functions
  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptySponsorItem }]);
  };
  const onUpdate = (row) => {
    row.amount = Math.max(row.amount, 0);

    const newRows = rows.map((r) => {
      if (r.id === row.id) return row;
      return r;
    });
    setRows(newRows);
    setError("");
    return row;
  };
  const onDelete = (row) => {
    setRows(rows.filter((r) => r.id !== row.id));
  };

  // grid column definition
  const columns = [
    {
      field: "name",
      headerName: "Sponsor Name",
      width: 200,
      flex: isMobile ? null : 1.5,
      editable: editable,
      renderCell: (p) => {
        return p.value ? (
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              msHyphens: "auto",
              MozHyphens: "auto",
              WebkitHyphens: "auto",
              hyphens: "auto",
              px: "10px",
              py: "10px",
            }}
          >
            {p.value}
          </Typography>
        ) : (
          <Typography
            color="text.secondary"
            sx={{
              px: "10px",
              py: "10px",
            }}
          >
            <i>Double click to edit</i>
          </Typography>
        );
      },
      display: "flex",
    },
    {
      field: "website",
      headerName: "Official Website",
      width: 200,
      flex: isMobile ? null : 1.75,
      editable: editable,
      renderCell: (p) => {
        return p.value ? (
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              msHyphens: "auto",
              MozHyphens: "auto",
              WebkitHyphens: "auto",
              hyphens: "auto",
              px: "10px",
              py: "10px",
            }}
          >
            {p.value}
          </Typography>
        ) : (
          <Typography
            color="text.secondary"
            sx={{
              px: "10px",
              py: "10px",
            }}
          >
            <i>Double click to edit</i>
          </Typography>
        );
      },
      display: "flex",
    },
    {
      field: "amount",
      type: "number",
      headerName: "Amount",
      flex: isMobile ? null : 1,
      editable: editable,
      renderCell: (p) => (
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {fCurrency(p.value)}
        </Typography>
      ),
      display: "flex",
    },
    {
      field: "previouslySponsored",
      type: "boolean",
      headerName: "Previously Sponsored?",
      width: isMobile ? 20 : 200,
      editable: editable,
      headerAlign: "center",
      align: "center",
      renderCell: (p) => (
        <Icon
          external
          color={!!p.value ? "success.main" : "error.main"}
          variant={!!p.value ? "eva:checkmark-outline" : "eva:close-outline"}
        />
      ),
      display: "flex",
    },
    ...(editable
      ? [
          {
            field: "action",
            align: "center",
            headerName: "",
            width: isMobile ? 20 : 50,
            renderCell: (p) => (
              <IconButton onClick={() => onDelete(p)} size="small">
                <Icon
                  color="error.main"
                  variant="delete-forever-outline"
                  sx={{ height: 16, width: 16 }}
                />
              </IconButton>
            ),
            display: "flex",
          },
        ]
      : []),
  ];

  return (
    <>
      {editable ? (
        <Button size="small" variant="outlined" onClick={onAdd} sx={{ mb: 1 }}>
          <Icon variant="add" mr={1} />
          Add Item
        </Button>
      ) : null}

      <DataGrid
        autoHeight
        getRowHeight={() => "auto"}
        columns={columns}
        rows={rows}
        editMode="row"
        processRowUpdate={onUpdate}
        disableRowSelectionOnClick
        onProcessRowUpdateError={(error) => {
          console.error("Row update error:", error);
          setError(error.message);
        }}
        sx={{
          // disable cell selection style
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
      />

      <Typography variant="caption" color="error">
        {error}
      </Typography>
    </>
  );
}
