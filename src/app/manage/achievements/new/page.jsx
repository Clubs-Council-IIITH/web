import { Container, Typography } from "@mui/material";
import AchievementForm from "components/achievements/AchievementsForm";

export default function NewAchievement(){
    return (
        <Container>
          <Typography
          variant="h3"
          sx={{mb:3}}>
                Create new Achievement
            </Typography>
            <AchievementForm />
        </Container>
    )
}