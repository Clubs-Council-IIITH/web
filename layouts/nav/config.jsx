// @mui
import {
    HomeTwoTone as HomeIcon,
    ExploreTwoTone as ClubsIcon,
    GroupsTwoTone as SBIcon,
    CalendarTodayTwoTone as CalendarIcon,
} from "@mui/icons-material";

const navConfig = [
    {
        title: "home",
        path: "/",
        icon: <HomeIcon fontSize="small" />,
    },
    {
        title: "clubs",
        path: "/clubs",
        icon: <ClubsIcon fontSize="small" />,
    },
    {
        title: "student bodies",
        path: "/student-bodies",
        icon: <SBIcon fontSize="small" />,
    },
    {
        title: "calendar",
        path: "/calendar",
        icon: <CalendarIcon fontSize="small" />,
    },
];

export default navConfig;
