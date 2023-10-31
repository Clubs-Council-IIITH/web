"use client";

import { DataGrid, GridLogicOperator } from "@mui/x-data-grid";
// import QuickSearchToolbar from "components/QuickSearchToolbar";
import ClubBox from "./clubs/ClubBox";

const columns = [
    {
        field: "eventName",
        headerName: "Event Name",
        // flex: 5,
        minWidth: 210,
    },
    {
        field: "club",
        headerName: "Club",
        minWidth: 200,
        // flex: 5,
        renderCell: ({ value }) => (
            <>
                {value ? <ClubBox club={value} /> : null}
            </>
        ),
    },
    {
        field: "date",
        headerName: "Date",
        minWidth: 170,
        // flex: 6,
    },
    {
        field: "time",
        headerName: "Time",
        minWidth: 170,
        // flex: 5,
    },
    {
        field: "venue",
        headerName: "Venue",
        align: "center",
        headerAlign: "center",
        minWidth: 210,
        // flex: 5,
    },
];

export default function BuzzSchedule({ events, allClubs }) {
    if (!events) return null;

    const updatedEvents = events.map((event) => {
        let newEvent = event;
        newEvent.club = allClubs.find((club) => club.clubid === event.club);
        return newEvent;
    });

    return (
        <DataGrid
            rows={updatedEvents}
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
            // slots={{ toolbar: QuickSearchToolbar }}
            sx={{
                mt: 5,
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
