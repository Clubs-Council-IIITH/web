import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";
import CertificateGenerationForm from "components/profile/CertificateGenerationForm";

export default async function GenerateCertificatePage({ params }) {
  const { data, error } = await getClient().query(GET_USER_PROFILE, {
    userInput: { uid: params.id },
  });

  if (error) {
    return <div>Error: Failed to load user profile</div>;
  }

  const userProfile = { ...data.userProfile, ...data.userMeta };

  return <CertificateGenerationForm userProfile={userProfile} />;
}
