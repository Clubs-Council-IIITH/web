import { useCallback, useEffect, useState } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import clsx from 'clsx';

import Iconify from "components/iconify/Iconify";

function checkYear(year) {
    const minYear = 2010;
    const maxYear = new Date().getFullYear();
    return year <= maxYear && year > minYear ? true : false;
}

let promiseTimeout;
function validateYear(year) {
  return new Promise((resolve) => {
    promiseTimeout = setTimeout(() => {
      resolve(checkYear(year) ? true : false);
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function MemberRoles({ rows, onUpdate = null, onDelete = null, editable = false }) {
    // const handleProcessRowUpdateError = useCallback((error) => {
    //     console.error(error);
    // }, []);

    const preProcessEditCellProps = async (params) => {
        const error = !(validateYear(params.props.value));
        console.log(error, params.props)
        return { ...params.props, error: error };
    };

    useEffect(() => {
        return () => {
          clearTimeout(promiseTimeout);
        };
      }, []);

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
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('super-app', {
                    negative: !checkYear(params.value),
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
            headerAlign: "center",
            align: "center",
            cellClassName: (params) => {
                if (params.value == null) {
                    return '';
                }

                return clsx('super-app', {
                    negative: !checkYear(params.value) && params.value !== null,
                    positive: checkYear(params.value) || params.value === null,
                });
            },
            // preProcessEditCellProps
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
