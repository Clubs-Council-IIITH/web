"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useToast } from "components/Toast";

export default function CertificateGenerationForm({ userProfile }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { triggerToast } = useToast();

  const handleCertificateRequest = async () => {
    setLoading(true);
    try {
      let res = await fetch("/actions/certificates/request", {
        method: "POST",
        body: JSON.stringify({
          certificateInput: { requestReason: userProfile.uid },
        }),
      });
      res = await res.json();

      if (res.ok) {
        triggerToast({
          title: "Success!",
          messages: [
            "Certificate request submitted successfully. Please wait for approval.",
          ],
          severity: "success",
        });
        router.push(`/profile/${userProfile.uid}`);
        router.refresh();
      } else {
        throw new Error(
          res.error.messages[0] || "Failed to request certificate"
        );
      }
    } catch (err) {
      triggerToast({
        title: "Error",
        messages: [err.message],
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        Generate Certificate
      </Typography>
      <Card>
        <CardHeader
          title="User Details"
          titleTypographyProps={{ variant: "h5" }}
        />
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Typography>
              <strong>Name:</strong> {userProfile.firstName}{" "}
              {userProfile.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {userProfile.email}
            </Typography>
            <Typography>
              <strong>Roll Number:</strong> {userProfile.rollno}
            </Typography>
            <Typography>
              <strong>Batch:</strong> {userProfile.batch}
            </Typography>
            <Typography>
              <strong>Stream:</strong> {userProfile.stream}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {userProfile.phone}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCertificateRequest}
            disabled={loading}
          >
            {loading ? "Requesting..." : "Request Certificate"}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
