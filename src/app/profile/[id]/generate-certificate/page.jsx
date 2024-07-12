import { getClient } from "gql/client";
import { GET_USER_PROFILE } from "gql/queries/users";
import { GET_MEMBERSHIPS } from "gql/queries/members";
import CertificateGenerationForm from "components/profile/CertificateGenerationForm";

export default async function GenerateCertificatePage({ params }) {
  const { data, error } = await getClient().query(GET_USER_PROFILE, {
    userInput: { uid: params.id },
  });

  if (error) {
    return <div>Error: Failed to load user profile</div>;
  }

  const userProfile = { ...data.userProfile, ...data.userMeta };

  let memberships = [];
  const {
    data: { memberRoles },
  } = await getClient().query(GET_MEMBERSHIPS, {
    uid: userProfile.uid,
  });
  memberships = memberRoles.reduce(
    (cv, m) =>
      cv.concat(
        m.roles
          .filter((r) => !r.deleted)
          .map((r) => ({
            startYear: r.startYear,
            endYear: r.endYear,
            name: r.name,
            cid: m.cid,
          })),
      ),
    [],
  );

  return (
    <CertificateGenerationForm
      userProfile={userProfile}
      memberships={memberships}
    />
  );
}
