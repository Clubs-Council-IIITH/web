import { getClient } from "gql/client";

import { Box, Button, Grid, Typography } from "@mui/material";
import AllCertificatesTable from "components/certificates/AllCertificatesTable";
import { GET_ALL_CERTIFICATES } from "gql/queries/members"

export default async function AllCertificates() {
    const { error, data : { getAllCertificates } = {} } = await getClient().query(GET_ALL_CERTIFICATES);
    return (
        <div className="container mx-auto p-4">
        <Grid
            container
            item
            sx={{ display: "flex", justifyContent: "space-between" }}
        >
            <Typography variant="h3" gutterBottom mt={2}>
                All Certificates
            </Typography>
            <Box mt={3} mb={4}>
                <Button variant="contained" color="primary" href="/manage/certificates">
                    View Pending Certificates
                </Button>
            </Box>
        </Grid>
        <AllCertificatesTable Certs={getAllCertificates} />
        </div>
        );
}