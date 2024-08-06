import { Suspense } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";

import PendingCertificatesTable from "components/certificates/PendingCertificatesTable";

export default function CertificateRequestsPage() {
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
          <Button variant="contained" color="primary" href="/certificate-requests/all">
            View All Certificates
          </Button>
        </Box>
      </Grid>
      <Suspense fallback={<div>Loading...</div>}>
        <PendingCertificatesTable />
      </Suspense>
    </div>
  );
}
