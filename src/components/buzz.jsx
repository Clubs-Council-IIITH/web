"use client";

import { useRouter } from "next/navigation";
import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
import QuickSearchToolbar from "components/QuickSearchToolbar";
import ClubLogo from "./clubs/ClubLogo";
const columns = [
    {
        field: "eventName",
        headerName: "Event Name",
        flex:5,
    },
    {
        field: "img",
        headerName: "",
        flex: 1,
        valueGetter: ({ row }) => ({ name: row.clubid, logo: row.clubid }),
        renderCell: ({ value }) => (
          <ClubLogo name={value.logo} logo={value.clubid} width={32} height={32} />
        ),
    },
    {
        field: "clubid",
        headerName: "Club",
        flex: 6,
    },
    {
        field: "date",
        headerName: "Date",
        flex:5,
    },
    {
        field: "time",
        headerName: "Time",
        flex:5,
    },
    {
        field: "venue",
        headerName: "Venue",
        align: "center",
        headerAlign: "center",
        flex:5,
    },
];

export default function ClubsTable({ clubs }) {
    const router = useRouter();
    if (!clubs) return null;

    return (
        <DataGrid
        rows={clubs}
        columns={columns}
        initialState={{
                sorting: {
                    sortModel: [{ field: "date", sort: "asc" }],
                },
                filter: {
                    filterModel: {
                        items: [],
                        quickFilterLogicOperator: GridLogicOperator.Or,
                    },
                },
            }}
            slots={{ toolbar: QuickSearchToolbar }}
            sx={{
                // disable cell selection style
                ".MuiDataGrid-cell:focus": {
                    outline: "none",
                },
                // pointer cursor on ALL rows
                "& .MuiDataGrid-row:hover": {
                    cursor: "pointer",
                },
                "& .MuiDataGrid-footerContainer": {
                    display: "none",
                }
            }}
        />
        
    );
}
