import { Suspense } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";

import AllCertificatesTable from "components/certificates/AllCertificatesTable";

export default function AllCertificatesPage() {
  return (
    <div>
      <Grid
        container
        item
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h3" gutterBottom mt={2}>
          All Certificates
        </Typography>
        <Box mt={3} mb={4}>
          <Button variant="contained" color="primary" href="/certificate-requests">
            View Pending Certificate Requests
          </Button>
        </Box>
      </Grid>
      <Suspense fallback={<div>Loading...</div>}>
        <AllCertificatesTable />
      </Suspense>
    </div>
  );
}
