import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"

export default function EventBudget({ editable = false }) {
    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            editable: editable,
        },
        {
            field: "amount",
            headerName: "Amount",
            width: 150,
            editable: editable,
        },
        {
            field: "type",
            headerName: "Type",
            width: 180,
            editable: editable,
        },
    ];

    // TODO: use currencyformatter on amounts
    const rows = [
        { id: 1, name: "prize money", amount: 0.00, type: "reimbursement" },
        { id: 2, name: "refreshments", amount: 0.00, type: "reimbursement" },
        { id: 3, name: "miscellaneous", amount: 0.00, type: "reimbursement" },
    ];

    return (
        <Box mt={2} sx={{ height: 500, width: "100%" }}>
            <DataGrid columns={columns} rows={rows} experimentalFeatures={{ newEditingApi: true }} />
        </Box>
    )
}
