import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Typography } from "@mui/material";

import Icon from "components/Icon";
import { fCurrency } from "utils/formatCurrency";

export default function EventBudget({
  editable,
  rows = [],
  setRows = console.log,
}) {
  // budget item template
  const emptyBudgetItem = { description: null, amount: 0, advance: false };

  // data manipulation functions
  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptyBudgetItem }]);
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

  // grid column definition
  const columns = [
    {
      field: "description",
      headerName: "Description",
      width: 250,
      flex: 2,
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
      field: "amount",
      type: "number",
      headerName: "Amount",
      flex: 1,
      editable: editable,
      valueFormatter: (p) => fCurrency(p?.value),
    },
    {
      field: "advance",
      type: "boolean",
      headerName: "Advance",
      width: 130,
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
        columns={columns}
        rows={rows}
        editMode="row"
        processRowUpdate={onUpdate}
        disableRowSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  );
}
