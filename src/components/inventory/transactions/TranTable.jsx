"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import { TransactionStatus } from "components/inventory/transactions/TranStates";

/**
 * TranTable - Displays a table of inventory transactions.
 * - Responsive design for mobile.
 * - Navigates to transaction details on row click.
 */
export default function TranTable({ transactions: initialTransactions, item = null }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for transactions
  const [transactions, setTransactions] = useState(initialTransactions || []);

  useEffect(() => {
    setTransactions(initialTransactions || []);
  }, [initialTransactions]);

  const columns = useMemo(() => {
    const sharedColumns = [
      { field: "quantity", headerName: "Quantity", width: 110 },
      { field: "borrow_date", headerName: "Borrowed on", width: 150 },
      {
        field: "period",
        headerName: "Period",
        flex: 1,
        valueGetter: (value, row) =>
          value || [row?.startDate, row?.endDate].filter(Boolean).join(" - "),
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        renderCell: (params) => <TransactionStatus status={params.value} />,
      },
    ];

    if (item) {
      return [
        { field: "user", headerName: "Requested By", flex: 1 },
        ...sharedColumns,
      ];
    }

    return [
      { field: "itemName", headerName: "Item Name", flex: 1 },
      { field: "brand", headerName: "Brand", width: 120 },
      { field: "user", headerName: "User", width: 120 },
      ...sharedColumns,
    ];
  }, [item]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minWidth: 600 }}>
      <DataGrid
        autoHeight
        rows={transactions}
        columns={columns}
        getRowId={(row) => row?._id ?? row?.id}
        pageSize={isMobile ? 3 : 5}
        rowsPerPageOptions={isMobile ? [3] : [5]}
        onRowClick={(params) => {
          router.push(`/manage/inventory/transactions/${params.row._id ?? params.row.id}`);
        }}
        sx={{ minWidth: 600 }}
      />
    </Box>
  );
}
