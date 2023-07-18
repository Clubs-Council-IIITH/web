import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import eventsschedule from "public/assets/json/eventsschedule.json";

import {
    AbcOutlined,
    RemoveOutlined,
    SportsSoccerOutlined,
    PrecisionManufacturing,
    EscalatorWarningOutlined,
    CameraEnhanceOutlined,
    TodayOutlined,
    PlayCircleFilledOutlined,
    Computer,
    Groups2Outlined,
    TravelExploreOutlined,
    VideogameAssetOutlined,
    PeopleOutlined,
    NightlifeOutlined,
    EmojiEmotionsOutlined,
    BrushOutlined,
    ColorLensOutlined,
    PsychologyOutlined,
    QuizOutlined,
    BorderColorOutlined,
    LanguageOutlined,
    MovieCreationOutlined,
} from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const IconsList = {
    "AbcOutlined": <AbcOutlined />,
    "RemoveOutlined": <RemoveOutlined />,
    "SportsSoccerOutlined": <SportsSoccerOutlined />,
    "PrecisionManufacturing": <PrecisionManufacturing />,
    "EscalatorWarningOutlined": <EscalatorWarningOutlined />,
    "CameraEnhanceOutlined": <CameraEnhanceOutlined />,
    "TodayOutlined": <TodayOutlined />,
    "PlayCircleFilledOutlined": <PlayCircleFilledOutlined />,
    "Computer": <Computer />,
    "Groups2Outlined": <Groups2Outlined />,
    "TravelExploreOutlined": <TravelExploreOutlined />,
    "VideogameAssetOutlined": <VideogameAssetOutlined />,
    "PeopleOutlined": <PeopleOutlined />,
    "NightlifeOutlined": <NightlifeOutlined />,
    "EmojiEmotionsOutlined": <EmojiEmotionsOutlined />,
    "BrushOutlined": <BrushOutlined />,
    "ColorLensOutlined": <ColorLensOutlined />,
    "PsychologyOutlined": <PsychologyOutlined />,
    "QuizOutlined": <QuizOutlined />,
    "BorderColorOutlined": <BorderColorOutlined />,
    "LanguageOutlined": <LanguageOutlined />,
    "MovieCreationOutlined": <MovieCreationOutlined />,
};


const TimelineElement = ({
    title,
    location,
    description,
    className = "others",
    date,
    icon: Icon = <></>,
    theme = null
}) => (
    className === "empty" ? (
        <VerticalTimelineElement
            iconStyle={{ background: "rgb(0,0,0)", color: "#fff" }}
            icon={<RemoveOutlined />}
        />
    ) : className === "date" ? (
        <VerticalTimelineElement
            iconStyle={{ background: "rgb(0,0,0)", color: "#fff" }}
            icon={<TodayOutlined />}
        />
    ) : className === "blue" ? (
        <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(18, 110, 184)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid rgb(18, 110, 184)" }}
            date={date}
            dateClassName="timelineDate"
            iconStyle={{ background: "rgb(18, 110, 184)", color: "#fff" }}
            icon={Icon}
        >
            <h3 className="vertical-timeline-element-title"><u>{title}</u></h3>
            <h4 className="vertical-timeline-element-subtitle">{location}</h4>
            <p>{description}</p>
        </VerticalTimelineElement>
    ) : className === "red" ? (
        <VerticalTimelineElement
            className="vertical-timeline-element--education"
            contentStyle={{ background: "rgb(233, 30, 90)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid rgb(233, 30, 90)" }}
            date={date}
            dateClassName="timelineDate"
            iconStyle={{ background: "rgb(233, 30, 90)", color: "#fff" }}
            icon={Icon}
        >
            <h3 className="vertical-timeline-element-title"><u>{title}</u></h3>
            <h5 className="vertical-timeline-element-subtitle">{location}</h5>
            <p>{description}</p>
        </VerticalTimelineElement>
    ) : className === "yellow" ? (
        <VerticalTimelineElement
            className="vertical-timeline-element--education"
            contentStyle={{ background: "rgb(168, 157, 5)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid rgb(168, 157, 5)" }}
            date={date}
            dateClassName="timelineDate"
            iconStyle={{ background: "rgb(168, 157, 5)", color: "#fff" }}
            icon={Icon}
        >
            <h3 className="vertical-timeline-element-title"><u>{title}</u></h3>
            <h4 className="vertical-timeline-element-subtitle">{location}</h4>
            <p>{description}</p>
        </VerticalTimelineElement>
    ) : className === "green" ? (
        <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid rgb(16, 204, 82)" }}
            date={date}
            dateClassName="timelineDate"
            iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
            icon={Icon}
        >
            <h3 className="vertical-timeline-element-title"><u>{title}</u></h3>
            <h4 className="vertical-timeline-element-subtitle">{location}</h4>
            <p>{description}</p>
        </VerticalTimelineElement>
    ) : (
        <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(176, 9, 127)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid rgb(176, 9, 127)" }}
            date={date}
            dateClassName="timelineDate"
            iconStyle={{ background: "rgb(176, 9, 127)", color: "#fff" }}
            icon={Icon}
        >
            <h3 className="vertical-timeline-element-title"><u>{title}</u></h3>
            <h4 className="vertical-timeline-element-subtitle">{location}</h4>
            <p>{description}</p>
        </VerticalTimelineElement>
    )
);

export default function EventsSchedule() {
    const theme = useTheme();
    return (
        <>
            <VerticalTimeline lineColor="black">
                {eventsschedule.map((member, key) => (
                    <TimelineElement {...member} icon={IconsList[member["icon"]]} theme={theme} key={key}></TimelineElement>
                ))}
            </VerticalTimeline>
            <Divider />
        </>
    );
}