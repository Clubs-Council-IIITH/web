import { useEffect, useState } from "react";

import { Alert, Grid } from "@mui/material";

import Iconify from "components/iconify";
import { stateLabel } from "utils/formatEvent";

export default function EventStatus({ status }) {
    const [currentState, setCurrentState] = useState({});

    useEffect(() => {
        const newState = stateLabel(status?.state);
        setCurrentState({
            icon: <Iconify icon={newState?.icon} />,
            severity: newState?.color,
            text: newState?.name,
        });
    }, [status?.state]);

    return (
        <Grid container spacing={2}>
            {/* current event status */}
            <Grid item xs md={12} lg>
                <Alert
                    sx={{ display: "flex", alignItems: "center" }}
                    icon={currentState?.icon}
                    severity={currentState?.severity}
                >
                    {currentState?.text}
                </Alert>
            </Grid>

            {/* budget status */}
            <Grid item xs={12} md={6} lg={4}>
                <Alert
                    sx={{ display: "flex", alignItems: "center" }}
                    icon={
                        <Iconify
                            icon={status?.budget ? "eva:checkmark-outline" : "eva:close-outline"}
                        />
                    }
                    severity={status?.budget ? "success" : "error"}
                >
                    {status?.budget ? "Budget approved" : "Budget not approved"}
                </Alert>
            </Grid>

            {/* venue status */}
            <Grid item xs={12} md={6} lg={4}>
                <Alert
                    sx={{ display: "flex", alignItems: "center" }}
                    icon={
                        <Iconify
                            icon={status?.venue ? "eva:checkmark-outline" : "eva:close-outline"}
                        />
                    }
                    severity={status?.venue ? "success" : "error"}
                >
                    {status?.venue ? "Venue approved" : "Venue not approved"}
                </Alert>
            </Grid>
        </Grid>
    );
}
