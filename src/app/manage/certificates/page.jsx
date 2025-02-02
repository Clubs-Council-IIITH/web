import { getClient } from "gql/client";

import { Box, Button, Grid, Typography } from "@mui/material";
import PendingCertificatesTable from "components/certificates/PendingCertificatesTable";
import { GET_PENDING_CERTIFICATES } from "gql/queries/members"

export default async function PendingCertificates() {
    const { data: { getPendingCertificates } = {} } = await getClient().query(GET_PENDING_CERTIFICATES);
    return (
        <div className="container mx-auto p-4">
        <Grid
            container
            item
            sx={{ display: "flex", justifyContent: "space-between" }}
        >
            <Typography variant="h3" gutterBottom mt={2}>
                Pending Certificate Requests
            </Typography>
            <Box mt={3} mb={4}>
                <Button variant="contained" color="primary" href="/manage/certificates/all">
                    View All Certificates
                </Button>
            </Box>
        </Grid>
        <PendingCertificatesTable pendingCerts={getPendingCertificates} />
        </div>
        );
}