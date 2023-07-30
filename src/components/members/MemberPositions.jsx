"use client";

import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Typography } from "@mui/material";

import Tag from "components/Tag";
import Icon from "components/Icon";

export default function MemberPositions({
  editable,
  rows = [],
  setRows = console.log,
}) {
  // position item template
  const emptyPositionItem = {
    name: null,
    startYear: new Date().getFullYear(),
    endYear: null,
  };

  // data manipulation functions
  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptyPositionItem }]);
  };
  const onUpdate = (row) => {
    const newRows = rows.map((r) => {
      if (r.id === row.id) return row;
      return r;
    });
    setRows(newRows);
    return row;
  };
  const onDelete = (row) => {
    setRows(rows.filter((r) => r.id !== row.id));
  };

  const columns = [
    {
      field: "name",
      headerName: "Role",
      flex: 4,
      editable: editable,
      renderCell: (p) =>
        p.value ? (
          p.value
        ) : (
          <Typography color="text.secondary">
            <i>Double click to edit</i>
          </Typography>
        ),
    },
    {
      field: "startYear",
      headerName: "Start Year",
      flex: 2,
      editable: editable,
    },
    {
      field: "endYear",
      headerName: "End Year",
      valueGetter: ({ row }) => row.endYear || "-",
      flex: 2,
      editable: editable,
    },
    ...(editable
      ? [
          {
            field: "action",
            align: "center",
            headerName: "",
            width: 50,
            renderCell: (p) => (
              <IconButton onClick={() => onDelete(p)} size="small">
                <Icon
                  color="error.main"
                  variant="delete-forever-outline"
                  sx={{ height: 16, width: 16 }}
                />
              </IconButton>
            ),
          },
        ]
      : [
          {
            field: "approved",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            flex: 2,
            renderCell: ({ value }) => (
              <Tag
                label={value ? "Approved" : "Pending"}
                color={value ? "success" : "warning"}
              />
            ),
          },
        ]),
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
        rows={rows}
        columns={columns}
        editMode="row"
        processRowUpdate={onUpdate}
        disableRowSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        sx={{
          // disable cell selection style
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
      />
    </>
  );
}
