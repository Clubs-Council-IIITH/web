import { Suspense } from "react";
import PendingCertificatesTable from "components/certificates/PendingCertificatesTable";

export default function CertificateRequestsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Certificate Requests</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PendingCertificatesTable />
      </Suspense>
    </div>
  );
}
