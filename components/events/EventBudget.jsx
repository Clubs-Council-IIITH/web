import { useCallback } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import clsx from 'clsx';

import { fCurrency } from "utils/formatCurrency";
import Iconify from "components/iconify/Iconify";

export default function EventBudget({ rows, onUpdate = null, onDelete = null, editable = false, budgetError = false, setBudgetError = null }) {
    // const handleProcessRowUpdateError = useCallback((error) => {
    //     console.error(error);
    // }, []);

    const preProcessEditCellProps = async (params) => {
        if (params.hasChanged) {
            const error = params.props.value <= 0;
            setBudgetError(error);
            // return { ...params.props, error: error };
        }
        return params.props;
    };

    const columns = [
        {
            field: "description",
            headerName: "Description",
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
            cellClassName: (params) => {
                if (params.value > 0)
                    return '';

                return clsx('amount', {
                    negative: params.value == null || params.value <= 0,
                    positive: params.value > 0,
                });
            },
            valueFormatter: (p) => fCurrency(p?.value),
            preProcessEditCellProps
        },
        {
            field: "advance",
            type: "boolean",
            headerName: "Advance",
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
        <Box sx={{
            height: 500,
            width: "100%",
            '& .amount.positive': {
                backgroundColor: 'rgba(157, 255, 118, 0.49)',
                color: '#1a3e72',
                fontWeight: '600',
            },
            '& .amount.negative': {
                backgroundColor: '#d47483',
                color: '#1a3e72',
                fontWeight: '600',
            },
        }}>
            <DataGrid
                editMode="row"
                columns={columns}
                rows={rows || []}
                disableRowSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                processRowUpdate={onUpdate}
            // onProcessRowUpdateError={handleProcessRowUpdateError}
            />
        </Box>
    );
}
