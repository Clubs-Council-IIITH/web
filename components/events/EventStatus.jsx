import { useEffect, useState } from "react";

import { Alert, Grid } from "@mui/material";

import Iconify from "components/iconify";
import { stateLabel } from "utils/formatEvent";

export default function EventStatus({ status, location, budget }) {
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
                            icon={status?.budget || !budget?.length ? "eva:checkmark-outline" : "eva:close-outline"}
                        />
                    }
                    severity={status?.budget || !budget?.length ? "success" : "error"}
                >
                    {budget?.length ? (status?.budget ? "Budget approved" : "Budget not approved") : "No Budget"}
                </Alert>
            </Grid>

            {/* venue status */}
            <Grid item xs={12} md={6} lg={4}>
                <Alert
                    sx={{ display: "flex", alignItems: "center" }}
                    icon={
                        <Iconify
                            icon={location?.length ? (status?.room ? "eva:checkmark-outline" : "eva:close-outline") : "ic:outline-minus"}
                        />
                    }
                    severity={location?.length ? (status?.room ? "success" : "error"): "info"}
                >
                    {location?.length ? (status?.room ? "Venue approved" : "Venue not approved") : "No Venue"}
                </Alert>
            </Grid>
        </Grid>
    );
}
