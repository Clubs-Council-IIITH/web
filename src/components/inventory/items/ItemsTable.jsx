"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";

import { useAuth } from "components/AuthProvider";

import { adjustAvailableQtyAction } from "actions/inventory/items/qty/server_action";

/**
 * ItemsTable - Displays a table of inventory items with toolbar, sorting, and
 * filtering — consistent with EventsTable and MembersTable.
 * - Navigates to item details on row click.
 * - Supports inline +/- quantity adjustment for CC and SLO users.
 */
export default function ItemsTable({
  items: initialItems,
  pageSize = 25,
  hideFooterPagination = false,
}) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const [items, setItems] = useState(initialItems || []);

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  const canEditQty = ["cc", "slo"].includes(user?.role);

  const handleAdjustAvailable = async (row, delta) => {
    const iid = row?.iid || row?.code;
    if (!iid) return;

    const currentAvail = row?.availableQty ?? 0;
    const netQty = row?.netQty?? 0;
    const optimisticAvail = Math.max(0, Math.min(netQty, currentAvail + delta));

    // Optimistic update — only availableQty changes
    setItems((prev) =>
      prev.map((item) =>
        item.iid === iid || item._id === row._id
          ? { ...item, availableQty: optimisticAvail, available_qty: optimisticAvail }
          : item,
      ),
    );

    const res = await adjustAvailableQtyAction(iid, delta);

    if (res.ok && res.data) {
      // Reconcile with actual server value
      const serverAvail = res.data.availableQty ?? res.data.available_qty;
      setItems((prev) =>
        prev.map((item) =>
          item.iid === iid || item._id === row._id
            ? { ...item, availableQty: serverAvail, available_qty: serverAvail }
            : item,
        ),
      );
    } else if (!res.ok) {
      // Revert on error
      setItems((prev) =>
        prev.map((item) =>
          item.iid === iid || item._id === row._id
            ? { ...item, availableQty: currentAvail, available_qty: currentAvail }
            : item,
        ),
      );
    }
  };

  const columns = [
    ...(!isMobile
      ? [
          {
            field: "iid",
            headerName: "Asset Code",
            flex: 3,
            renderCell: ({ value, row }) => (
              <Typography
                variant="body2"
                sx={{ color: "text.disabled", fontFamily: "monospace" }}
              >
                {value || row?.code || "—"}
              </Typography>
            ),
            display: "flex",
          },
        ]
      : []),
    {
      field: "name",
      headerName: "Item Name",
      flex: isMobile ? null : 5,
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
    },
    ...(!isMobile
      ? [
          {
            field: "brand",
            headerName: "Brand",
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
          },
          {
            field: "clubid",
            headerName: "Owner / Club",
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
          },
        ]
      : []),
    {
      field: "availableQty",
      headerName: "Available",
      flex: isMobile ? null : 3,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) =>
        row?.availableQty ?? 0,
      renderCell: ({ row }) => {
        const qty = row?.availableQty ?? 0;
        if (!canEditQty) return qty;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Typography variant="body2">{qty}</Typography>
          </Box>
        );
      },
      display: "flex",
    },
    {
      field: "netQty",
      headerName: "Net Qty",
      flex: isMobile ? null : 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row?.netQty ?? 0,
      display: "flex",
    },
    {
      field: "totalQty",
      headerName: "Total Qty",
      flex: isMobile ? null : 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row?.totalQty ?? 0,
      display: "flex",
    },
  ];

  return (
    <DataGrid
      rows={items}
      columns={columns}
      getRowId={(row) => row?._id}
      getRowHeight={() => null}
      onRowClick={(params) => {
        router.push(
          `/manage/inventory/items/${params.row?._id}`,
        );
      }}
      disableRowSelectionOnClick
      hideFooterPagination={hideFooterPagination}
      initialState={{
        sorting: {
          sortModel: [{ field: "name", sort: "asc" }],
        },
        filter: {
          filterModel: {
            items: [],
            quickFilterLogicOperator: GridLogicOperator.Or,
          },
        },
        pagination: { paginationModel: { pageSize } },
      }}
      getRowClassName={(params) => {
        const qty = params.row?.netQty ?? 0;
        return qty === 0 ? "out-of-stock-row" : "";
      }}
      showToolbar
      sx={{
        // disable cell selection outline
        ".MuiDataGrid-cell:focus": {
          outline: "none",
        },
        // pointer cursor on all rows
        "& .MuiDataGrid-row:hover": {
          cursor: "pointer",
        },
        "& .MuiDataGrid-cell": {
          padding: "8px",
        },
        "& .MuiDataGrid-columnHeader": {
          padding: "0 8px",
        },
        "& .out-of-stock-row": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(211, 47, 47, 0.25)"
              : "#ffebee",
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(211, 47, 47, 0.35)"
                : "#ffcdd2",
          },
        },
      }}
    />
  );
}