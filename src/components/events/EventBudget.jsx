"use client";

import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "components/Icon";
import { fCurrency } from "utils/formatCurrency";
import { validateBillno } from "components/events/bills/BillUpload";

export default function EventBudget({
  editable = false,
  rows = [],
  setRows = console.log,
  setBudgetEditing = console.log,
  billViewable = false,
  billEditable = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // budget item template
  const emptyBudgetItem = {
    description: null,
    amount: 0,
    advance: false,
    billno: null,
    amount_used: null,
  };

  // data manipulation functions
  const onAdd = () => {
    setRows([...rows, { id: rows?.length || 0, ...emptyBudgetItem }]);
  };
  const onUpdate = (row) => {
    row.amount = row.amount > 0 ? row.amount : 0;

    if (row.billno && !validateBillno(row.billno)) {
      throw new Error(
        "Bill number must contain only capital letters and digits",
      );
    }

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

  // Show extra fields only it amount used is > 0
  const showExtraFields = rows.some((r) => r.amountUsed > 0);

  // grid column definition
  const columns = [
    {
      field: "description",
      headerName: "Description",
      width: 200,
      flex: isMobile ? null : 4,
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
      headerName: billViewable ? "Amount" : "Proposed Amount",
      flex: isMobile ? null : 1,
      editable: editable,
      renderCell: (p) => (
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            px: "5px",
            py: "10px",
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
    ...(billEditable || (billViewable && showExtraFields)
      ? [
          {
            field: "billno",
            type: "string",
            headerName: "Bill No.",
            flex: isMobile ? null : 1,
            editable: billEditable,
            preProcessEditCellProps: (params) => {
              if (!params.hasChanged) {
                return params.props;
              }

              const hasError =
                params.props.value && !validateBillno(params.props.value);
              return { ...params.props, error: hasError };
            },
            renderCell: (p) => (
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: "5px",
                  py: "10px",
                  justifyContent: "center",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  "&::before": { content: '"#  "', color: "gray" },
                }}
              >
                {p.value}
              </Typography>
            ),
          },
          {
            field: "amountUsed",
            type: "number",
            headerName: "Amount Used",
            flex: isMobile ? null : 1,
            editable: billEditable,
            renderCell: (p) => (
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: "5px",
                  py: "10px",
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
        ]
      : []),
    {
      field: "advance",
      type: "boolean",
      headerName: "Advance",
      width: isMobile ? 20 : 100,
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
        onRowEditStart={(p) => setBudgetEditing(true)}
        onRowEditStop={(p) => setBudgetEditing(false)}
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
