import { useEffect, useState } from "react";

import { Alert } from "@mui/material";
import { RefreshOutlined as PendingIcon } from "@mui/icons-material";

export default function EventStatus({ state }) {
    const [status, setStatus] = useState({});

    useEffect(() => {
        // TODO: parse `state` and assign proper status
        setStatus({
            icon: <PendingIcon />,
            severity: "warning",
            text: "Pending Clubs Council approval",
        })
    }, [state]);

    return (
        <Alert icon={status?.icon} severity={status?.severity}>
            {status?.text}
        </Alert>
    )
}