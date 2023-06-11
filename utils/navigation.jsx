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
import SvgIcon from '@mui/material/SvgIcon';

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

const aboutConfig = {
    header: "about",
    items: [
        // {
        //     title: "SLC/SLO",
        //     path: "/slc",
        //     icon: <AboutIcon fontSize="small" />,
        // },
        {
            title: "Clubs Council",
            // path: "/clubscouncil",
            path: "/about",
            icon: <SvgIcon>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M329.1 142.9c-62.5-62.5-155.8-62.5-218.3 0s-62.5 163.8 0 226.3s155.8 62.5 218.3 0c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3c-87.5 87.5-221.3 87.5-308.8 0s-87.5-229.3 0-316.8s221.3-87.5 308.8 0c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0z" /></svg>
            </SvgIcon>,
        },
    ],
};

// Gets the navigation configuration for the sidebar
export function getNavConfig(user) {
    const navConfig = [];

    // Add public items
    navConfig.push(publicConfig);

    // If user is an admin, add manage items
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

    // If user is a club, add club-specific items
    if (user?.role === "club") {
        navConfig.push({
            header: "manage",
            items: [
                {
                    title: "Club",
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

    // Add about items
    navConfig.push(aboutConfig);

    // Add help items
    navConfig.push(helpConfig);

    return navConfig;
}
