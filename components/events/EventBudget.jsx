import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Iconify from "components/iconify/Iconify";

export default function EventBudget({ rows, editable = false }) {
    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            editable: editable,
        },
        {
            // TODO: use currencyformatter on amounts
            field: "amount",
            type: "number",
            headerName: "Amount",
            width: 180,
            editable: editable,
        },
        {
            field: "reimbursable",
            headerName: "Reimbursable",
            width: 160,
            editable: editable,
            headerAlign: "center",
            align: "center",
            renderCell: (p) => (
                <Iconify
                    color={p.value ? "success.main" : "error.main"}
                    icon={p.value ? "eva:checkmark-outline" : "eva:close-outline"}
                />
            ),
        },
    ];

    return (
        <Box mt={2} sx={{ height: 500, width: "100%" }}>
            <DataGrid
                columns={columns}
                rows={rows || []}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </Box>
    );
}
