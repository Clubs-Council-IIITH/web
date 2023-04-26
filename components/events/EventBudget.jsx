import { useCallback } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { fCurrency } from "utils/formatCurrency";
import Iconify from "components/iconify/Iconify";

export default function EventBudget({ rows, onUpdate = null, onDelete = null, editable = false }) {
    const handleProcessRowUpdateError = useCallback((error) => {
        console.error(error);
    }, []);

    const columns = [
        {
            field: "name",
            headerName: "Name",
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
            field: "reimbursable",
            type: "boolean",
            headerName: "Reimbursable",
            width: 130,
            editable: editable,
            headerAlign: "center",
            align: "center",
            renderCell: (p) => (
                <Iconify
                    color={!!p.value ? "success.main" : "error.main"}
                    icon={!!p.value ? "eva:checkmark-outline" : "eva:close-outline"}
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
                          <IconButton onClick={() => onDelete(p.id)} size="small">
                              <Iconify
                                  color="error.main"
                                  icon="eva:trash-outline"
                                  sx={{ height: 16, width: 16 }}
                              />
                          </IconButton>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
                editMode="row"
                columns={columns}
                rows={rows || []}
                disableRowSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={onUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
            />
        </Box>
    );
}
