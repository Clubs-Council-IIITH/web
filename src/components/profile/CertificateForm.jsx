"use client";

import { useState, useTransition } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Box,
    CircularProgress
} from '@mui/material';

export default function CertificateForm({ handleSubmit }) {
    const [reason, setReason] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isFormValid = reason.trim() !== '' && agreeToTerms;

    const onSubmit = (event) => {
        event.preventDefault();
        if (!isFormValid) return;

        startTransition(async () => {
            try {
                const formData = new FormData(event.target);
                const result = await handleSubmit(formData);
                if (result.success) {
                    // Optionally reset form here
                    setReason('');
                    setAgreeToTerms(false);
                } else {
                    console.error("Error submitting form:", result.message);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                triggerToast({
                    title: "Error",
                    messages: ["An unexpected error occurred. Please try again."],
                    severity: "error"
                });
            }
        });
    };

    return (
        <Box component="form" onSubmit={onSubmit}>
            <TextField
                name="reason"
                label="Reason for Certificate Generation"
                multiline
                rows={4}
                fullWidth
                required
                sx={{ mb: 2 }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        name="agreeToTerms"
                        required
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                    />
                }
                label="I agree to the terms and conditions"
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isFormValid || isPending}
                style={{
                    opacity: (isFormValid && !isPending) ? 1 : 0.5,
                    cursor: (isFormValid && !isPending) ? 'pointer' : 'not-allowed'
                }}
            >
                {isPending ? <CircularProgress size={24} /> : "Submit Request"}
            </Button>
        </Box>
    );
}