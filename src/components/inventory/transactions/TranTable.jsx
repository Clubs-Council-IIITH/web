"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";

import {
  Box,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import ConfirmDialog from "components/ConfirmDialog";
import Tag from "components/Tag";

const colorMap = {
  incomplete: "default",
  pending: "warning",
  pending_club: "warning",
  pending_slo: "warning",
  approved_slo: "info",
  borrowed: "info",
  completed: "success",
  rejected: "error",
  cancelled: "default",
  deleted: "error",
};

/**
 * TranTable - Displays a table of inventory transactions with toolbar,
 * sorting, filtering, and optional 4-month switch — consistent with EventsTable.
 */
export default function TranTable({
  transactions: initialTransactions,
  query,
  clubid,
  item = null,
  pageSize = 25,
  hideFooterPagination = false,
  canViewDeletedTransactions = false,
}) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Toggle state for Deleted Transactions
  const [deleteToggle, setDeleteToggle] = useState(true);
  // Toggle state for Last 4 Months
  const [filterMonth, setFilterMonth] = useState(["pastTransactionsLimit"]);
  const [transactions, setTransactions] = useState(initialTransactions || []);
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    if (!query) {
      setTransactions(initialTransactions || []);
      return;
    }

    async function fetchTransactions() {
      let params = {
        targetClub: clubid,
        pastTransactionsLimit: filterMonth.includes("pastTransactionsLimit") ? 4 : null,
        hideDeleted: deleteToggle,
      };
      const result = await query(params);
      setTransactions(result || []);
    }
    fetchTransactions();
  }, [query, clubid, filterMonth, deleteToggle, initialTransactions]);

  const columns = useMemo(() => {
    const itemCol = {
      field: "itemName",
      headerName: "Item",
      flex: 4,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "—"}
        </Typography>
      ),
      display: "flex",
    };

    const itemCodeCol = {
      field: "itemCode",
      headerName: "Asset Code",
      flex: 3,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{ color: "text.disabled", fontFamily: "monospace" }}
        >
          {value || "—"}
        </Typography>
      ),
      display: "flex",
    };

    const userCol = {
      field: "user",
      headerName: item ? "Requested By" : "User",
      flex: 3,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "—"}
        </Typography>
      ),
      display: "flex",
    };

    const clubCol = {
      field: "clubid",
      headerName: "Club",
      flex: 3,
      renderCell: ({ value, row }) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row?.clubName || value || "—"}
        </Typography>
      ),
      display: "flex",
    };

    const quantityCol = {
      field: "quantity",
      headerName: "Qty.",
      flex: 1,
      align: "center",
      headerAlign: "center",
      display: "flex",
    };

    const startDateCol = {
      field: "startDate",
      headerName: "Borrow Date",
      flex: 3,
      valueGetter: (value, row) =>
        row?.status?.borrowDate || row?.status?.borrow_date || row?.startDate || null,
      valueFormatter: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "—"),
      renderCell: ({ formattedValue }) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {formattedValue}
        </Typography>
      ),
      display: "flex",
    };

    const endDateCol = {
      field: "endDate",
      headerName: "Return By",
      flex: 3,
      valueFormatter: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "—"),
      renderCell: ({ formattedValue }) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {formattedValue}
        </Typography>
      ),
      display: "flex",
    };

    const statusCol = {
      field: "status",
      headerName: "Status",
      flex: 3,
      align: "center",
      headerAlign: "center",
      disableExport: true,
      valueGetter: (value) => value?.state || "unknown",
      renderCell: ({ value }) => (
        <Tag
          label={value.replaceAll("_", " ")}
          color={colorMap[value] || "default"}
          sx={{ my: 1, maxWidth: "100%", textTransform: "capitalize" }}
        />
      ),
      sortComparator: (v1, v2) => v1.localeCompare(v2),
      display: "flex",
    };

    if (isMobile) {
      return [
        ...(item ? [] : [itemCol]),
        quantityCol,
        statusCol,
      ];
    }

    if (item) {
      return [userCol, clubCol, quantityCol, startDateCol, endDateCol, statusCol];
    }

    return [itemCol, itemCodeCol, clubCol, quantityCol, startDateCol, endDateCol, statusCol];
  }, [item, isMobile]);

  return (
    <Grid>
      {query && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mb: 2,
            mt: 1,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={filterMonth.includes("pastTransactionsLimit")}
                onChange={(e) => {
                  if (
                    filterMonth.includes("pastTransactionsLimit") &&
                    !e.target.checked
                  ) {
                    setDialog(true);
                  } else {
                    setFilterMonth(
                      e.target.checked ? ["pastTransactionsLimit"] : [],
                    );
                  }
                }}
                color="primary"
              />
            }
            label="Last 4 Months"
            sx={{ marginLeft: 1 }}
          />
          {canViewDeletedTransactions && (
            <FormControlLabel
              control={
                <Switch
                  checked={deleteToggle}
                  onChange={(e) => setDeleteToggle(e.target.checked)}
                  color="primary"
                />
              }
              label="Hide Deleted Transactions"
              sx={{ marginLeft: 1 }}
            />
          )}
          <ConfirmDialog
            open={dialog}
            title="Are you sure you want to fetch all transactions?"
            description="Fetching all transactions from the start will take a lot of time."
            onConfirm={() => {
              setFilterMonth([]);
              setDialog(false);
            }}
            onClose={() => setDialog(false)}
            confirmProps={{ color: "error" }}
            confirmText="Yes, Fetch them"
          />
        </Box>
      )}

      <DataGrid
        rows={transactions}
        columns={columns}
        getRowId={(row) => row?._id ?? row?.id ?? row?.tid}
        getRowHeight={() => null}
        onRowClick={(params) => {
          router.push(
            `/manage/inventory/transactions/${params.row._id ?? params.row.id ?? params.row.tid}`,
          );
        }}
        disableRowSelectionOnClick
        hideFooterPagination={hideFooterPagination}
        initialState={{
          sorting: {
            sortModel: [{ field: "startDate", sort: "desc" }],
          },
          filter: {
            filterModel: {
              items: [],
              quickFilterLogicOperator: GridLogicOperator.Or,
            },
          },
          pagination: { paginationModel: { pageSize } },
        }}
        showToolbar
        sx={{
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
          "& .MuiDataGrid-cell": {
            padding: "8px",
          },
          "& .MuiDataGrid-columnHeader": {
            padding: "0 8px",
          },
        }}
      />
    </Grid>
  );
}
