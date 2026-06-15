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
import {EventStatus} from "components/events/EventStates";

/**
 * ItemsTable - Displays a table of inventory items with basic controls.
 * - Includes a toggle to show/hide unavailable items.
 * - Responsive design for mobile.
 * - Navigates to item details on row click.
 */
export default function ItemsTable({ items: initialItems, isPending }) {
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
        { field: "code", headerName: "Code", width: 120 },
        { field: "name", headerName: "Item Name", flex: 1 },
        { field: "brand", headerName: "Brand", flex: 1 },
        { field: "quantity", headerName: "Quantity", width: 120 }
    ];

    if(isPending===false)
    {
        columns.push(
            { field: "owner", headerName: "Owner", flex: 1 },
            { field: "status", headerName: "Status", width: 150, 
                renderCell: (params) => <EventStatus status={params.value} /> 
            }
        );
    }

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