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
 * ItemsTable - Displays a table of inventory items with basic controls.
 * - Includes a toggle to show/hide unavailable items.
 * - Responsive design for mobile.
 * - Navigates to item details on row click.
 */
export default function ItemsTable({ items: initialItems }) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Always show all items
    const [items, setItems] = useState(initialItems || []);

    useEffect(() => {
        setItems(initialItems || []);
    }, [initialItems]);

    // Table columns
    const columns = [
        { field: "name", headerName: "Item Name", flex: 1 },
        { field: "quantity", headerName: "Quantity", width: 120 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "category", headerName: "Category", width: 120 },
        { field: "location", headerName: "Location", width: 120 },
        { field: "lastTransaction", headerName: "Last Transaction", width: 160 },
        { field: "owner", headerName: "Owner", width: 120 },
        { field: "description", headerName: "Description", flex: 2 },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: 600 }}>
            <DataGrid
                autoHeight
                rows={items}
                columns={columns}
                pageSize={isMobile ? 3 : 5}
                rowsPerPageOptions={isMobile ? [3] : [5]}
                onRowClick={(params) => {
                    router.push(`/manage/inventory/items/${params.row._id}`);
                }}
                sx={{ minWidth: 600 }}
            />
        </Box>
    );
}