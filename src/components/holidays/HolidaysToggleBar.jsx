"use client";

import Link from "next/link";
import { Stack, Button, Switch, Typography } from "@mui/material";
import Icon from "components/Icon";

export default function HolidaysTitleBar({ showPast, onToggle, children }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h3" gutterBottom>
                Manage Holidays
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                    component={Link}
                    href="/manage/holidays/new"
                    variant="contained"
                    startIcon={<Icon variant="add" />}
                >
                    Add Holiday
                </Button>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6">Show Past</Typography>
                    <Switch checked={showPast} onChange={onToggle} color="primary" />
                </Stack>
                {children}
            </Stack>
        </Stack>
    );
}
