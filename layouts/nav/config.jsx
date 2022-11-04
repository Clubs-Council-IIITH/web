// @mui
import {
    HomeTwoTone as HomeIcon,
    ExploreTwoTone as ClubsIcon,
    GroupsTwoTone as SBIcon,
    CalendarTodayTwoTone as CalendarIcon,
    InfoTwoTone as AboutIcon,
    BugReportTwoTone as BugsIcon,
    LocalActivityTwoTone as EventsIcon,
    GroupsTwoTone as MembersIcon,
} from "@mui/icons-material";

const navConfig = [
    {
        header: "",
        items: [
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
        ],
    },
    {
        header: "manage",
        items: [
            {
                title: "Clubs",
                path: "/manage/clubs",
                icon: <ClubsIcon fontSize="small" />,
            },
            {
                title: "Events",
                path: "/manage/events",
                icon: <EventsIcon fontSize="small" />,
            },
            {
                title: "Members",
                path: "/manage/members",
                icon: <MembersIcon fontSize="small" />,
            },
        ],
    },
    {
        header: "help",
        items: [
            {
                title: "about",
                path: "/about",
                icon: <AboutIcon fontSize="small" />,
            },
            {
                title: "report bugs",
                path: "https://forms.office.com/pages/responsepage.aspx?id=vDsaA3zPK06W7IZ1VVQKHP5_krLw79FKvEUkWn__N_1UQlhYTlFQTlpBMUFCUFBSRkRSM0MxME5OTy4u",
                icon: <BugsIcon fontSize="small" />,
            },
        ],
    },
];

export default navConfig;
