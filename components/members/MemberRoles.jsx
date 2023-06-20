import { useCallback } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import clsx from 'clsx';

import Iconify from "components/iconify/Iconify";

function checkYear(year) {
    const minYear = 2010;
    const maxYear = new Date().getFullYear();
    return year <= maxYear && year > minYear ? true : false;
}

export default function MemberRoles({ rows, onUpdate = null, onDelete = null, editable = false, roleError = false, setRoleError = null }) {
    // const handleProcessRowUpdateError = useCallback((error) => {
    //     console.error(error);
    // }, []);

    const preProcessEditCellProps = async (params) => {
        if (params.hasChanged) {
            if ("startYear" in params.otherFieldsProps && params.props.value != null) {
                if (params.otherFieldsProps.startYear.value && params.otherFieldsProps.startYear.value > params.props.value) {
                    setRoleError(true);
                    // return { ...params.props, error: true };
                    return params.props;
                }
            }
            const error = !(checkYear(params.props.value));
            setRoleError(error);
            // return { ...params.props, error: error };
            return params.props;
        }
        return params.props;
    };

    const columns = [
        {
            field: "name",
            headerName: "Title",
            width: 100,
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
            field: "startYear",
            type: "number",
            headerName: "Start Year",
            flex: 1,
            editable: editable,
            headerAlign: "center",
            align: "center",
            cellClassName: (params) => {
                return clsx('super-app', {
                    negative: !checkYear(params.value) || params.value == null,
                    positive: checkYear(params.value),
                });
            },
            preProcessEditCellProps
        },
        {
            field: "endYear",
            type: "number",
            headerName: "End Year",
            editable: editable,
            flex: 1,
            headerAlign: "center",
            align: "center",
            cellClassName: (params) => {
                return clsx('super-app', {
                    negative: !checkYear(params.value) && params.value !== null,
                    positive: checkYear(params.value) || params.value === null,
                });
            },
            preProcessEditCellProps
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
            height: 450,
            width: "100%",
            '& .super-app.positive': {
                backgroundColor: 'rgba(157, 255, 118, 0.49)',
                color: '#1a3e72',
                fontWeight: '600',
            },
            '& .super-app.negative': {
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
