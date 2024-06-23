import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";
import { redirect } from "next/navigation";
import {
    Container,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Box
} from '@mui/material';

export default async function GenerateCertificate({ params }) {
    const { id } = params;

    // Fetch user data
    const { data: { userProfile, userMeta } = {} } = await getClient().query(
        GET_USER_PROFILE,
        {
            userInput: {
                uid: id,
            },
        },
    );
    const user = { ...userMeta, ...userProfile };

    if (!user) {
        return redirect("/404");
    }

    async function handleSubmit(formData) {
        "use server";

        const reason = formData.get("reason");
        const agreeToTerms = formData.get("agreeToTerms") === "on";

        if (!reason || !agreeToTerms) {
            // In a real application, you'd want to handle this error more gracefully
            // Perhaps by returning an error message that can be displayed to the user
            throw new Error("Please fill all required fields and agree to terms.");
        }

        // Here you would typically send the certificate generation request
        console.log("Certificate generation request submitted:", { user, reason });

        // Redirect back to the profile page
        redirect(`/profile/${id}`);
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Generate Certificate</Typography>

            <Typography variant="h6">User Details:</Typography>
            <Typography>Name: {user.firstName} {user.lastName}</Typography>
            <Typography>Email: {user.email}</Typography>

            <Typography variant="h6" style={{ marginTop: '20px' }}>Rules and Regulations:</Typography>
            <Typography variant="body2" style={{ marginBottom: '20px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod,
                nisi vel consectetur interdum, nisl nunc egestas nunc, vitae tincidunt
                nisl nunc euismod nunc.
            </Typography>

            <Box component="form" action={handleSubmit}>
                <TextField
                    name="reason"
                    label="Reason for Certificate Generation"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />

                <FormControlLabel
                    control={<Checkbox name="agreeToTerms" required />}
                    label="I agree to the terms and conditions"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Submit Request
                </Button>
            </Box>

            {/* script for client side validation without using "use client"; directive */}
            <script dangerouslySetInnerHTML={{
                __html: `
                document.querySelector('form').addEventListener('submit', function(e) {
                    const reason = this.querySelector('textarea[name="reason"]').value;
                    const agreeToTerms = this.querySelector('input[name="agreeToTerms"]').checked;
                    const submitButton = this.querySelector('button[type="submit"]');

                    if (!reason || !agreeToTerms) {
                        e.preventDefault();
                        alert("Please fill all required fields and agree to terms.");
                    }

                    submitButton.disabled = !agreeToTerms;
                });

                document.querySelector('input[name="agreeToTerms"]').addEventListener('change', function() {
                    const submitButton = this.form.querySelector('button[type="submit"]');
                    submitButton.disabled = !this.checked;
                });
            `}} />
        </Container>
    );
}