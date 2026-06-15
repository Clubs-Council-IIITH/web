"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Switch,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";

/**
 * TranTable - Displays a table of inventory transactions.
 * - Responsive design for mobile.
 * - Navigates to transaction details on row click.
 */
export default function TranTable({ transactions: initialTransactions, item }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for transactions
  const [transactions, setTransactions] = useState(initialTransactions || []);

  useEffect(() => {
    setTransactions(initialTransactions || []);
  }, [initialTransactions]);

  // Table columns
  const columns = [
    { field: "itemName", headerName: "Item Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", width: 120 },
    { field: "brand", headerName: "Brand", width: 120 },
    { field: "user", headerName: "User", width: 120 },
    { field: "borrow_date", headerName: "Borrowed on", width: 160 },
    { field: "status", headerName: "Status", width: 120 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 600 }}>
      <DataGrid
        autoHeight
        rows={transactions}
        columns={columns}
        pageSize={isMobile ? 3 : 5}
        rowsPerPageOptions={isMobile ? [3] : [5]}
        onRowClick={(params) => {
          router.push(`/manage/inventory/transactions/${params.row._id}`);
        }}
        sx={{ minWidth: 600 }}
      />
    </Box>
  );
}
