import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";
import { redirect } from "next/navigation";
import {
    Container,
    Typography,
} from '@mui/material';
import CertificateForm from "components/profile/CertificateForm";

export default async function GenerateCertificate({ params }) {
    const { id } = params;

    // fetchin user data
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
            return { success: false, message: "Please fill all required fields and agree to terms." };
        }

        // TODO: send request to generate certificate
        console.log("Certificate generation request submitted:", { user, reason });

        // dummy success message
        return { success: true, message: "Certificate generation request submitted successfully!" };
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

            <CertificateForm handleSubmit={handleSubmit} />
        </Container>
    );
}