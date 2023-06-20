import { useState } from "react";

import { Grid, Box } from "@mui/material";

export default function ActionPalette({ actions = [], ...props }) {
    const [view, setView] = useState("base");

    return {
        base: <BaseView actions={actions} setView={setView} {...props} />,
        ...Object.assign(
            {},
            ...actions
                ?.filter((a) => a.view !== null)
                ?.map((a) => ({ [a.name]: <a.view setView={setView} {...props} /> }))
        ),
    }[view];
}

function BaseView({ actions, setView, ...props }) {
    return (
        <Box sx={{ border: 1, borderRadius: 1, borderColor: "grey.300", borderStyle: "dashed" }}>
            <Grid container spacing={2} p={2}>
                {actions?.map((Action, key) => (
                    <Grid item xs key={key}>
                        <Action.button setView={setView} {...props} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
