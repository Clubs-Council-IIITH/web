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
    <Grid container spacing={1} justifyContent="flex-end">
      {actions?.map((Action, key) => (
        <Grid item key={key}>
          <Action.button setView={setView} {...props} />
        </Grid>
      ))}
    </Grid>
  );
}
