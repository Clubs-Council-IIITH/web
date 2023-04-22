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

const publicConfig = {
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
};

const helpConfig = {
    header: "help",
    items: [
        {
            title: "about",
            path: "/about",
            icon: <AboutIcon fontSize="small" />,
        },
        {
            title: "bugs",
            path: "/bugs",
            icon: <BugsIcon fontSize="small" />,
        },
    ],
};

export function getNavConfig(user) {
    const navConfig = [];

    // all public items
    navConfig.push(publicConfig);

    // if user is an admin, add manage items
    if (["cc"].includes(user?.role)) {
        navConfig.push({
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
        });
    }

    // if user is a club, add club-specific items
    if (user?.role === "club") {
        navConfig.push({
            header: "manage",
            items: [
                {
                    title: "Club",
                    path: "/manage/clubs",
                    page: "@mine",
                    icon: <ClubsIcon fontSize="small" />,
                },
                {
                    title: "Events",
                    path: "/manage/events",
                    page: "@mine",
                    icon: <EventsIcon fontSize="small" />,
                },
                {
                    title: "Members",
                    path: "/manage/members",
                    page: "@mine",
                    icon: <MembersIcon fontSize="small" />,
                },
            ],
        });
    }

    // all help items
    navConfig.push(helpConfig);

    return navConfig;
}
