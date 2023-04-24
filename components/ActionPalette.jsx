import { useState } from "react";

import { Grid, Box } from "@mui/material";

export default function ActionPalette({ actions = [] }) {
    const [view, setView] = useState("base");

    return {
        base: <BaseView actions={actions} setView={setView} />,
        ...Object.assign(
            {},
            ...actions
                ?.filter((a) => a.view !== null)
                ?.map((a) => ({ [a.name]: <a.view setView={setView} /> }))
        ),
    }[view];
}

function BaseView({ actions, setView }) {
    return (
        <Box sx={{ border: 1, borderRadius: 1, borderColor: "grey.300", borderStyle: "dashed" }}>
            <Grid container spacing={2} p={2}>
                {actions?.map((Action) => (
                    <Grid item xs>
                        <Action.button setView={setView} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
