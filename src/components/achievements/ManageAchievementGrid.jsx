import ManageAchievementCards from "./ManageAchievementCards";

export default async function ManageAchievementsGrid({
  achievements = null,
  edit,
}) {
  return (
    <ManageAchievementCards
      achievements={achievements}
      loading={false}
      noAchievementsMessage="No achievements found."
      edit={edit}
    />
  );
}
