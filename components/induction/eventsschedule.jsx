import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import {
    RemoveOutlined,
    TodayOutlined,
    PetsOutlined,
    Groups2Outlined,
    MeetingRoomOutlined,
    MicExternalOnOutlined,
    EmojiEventsOutlined,
    TransgenderOutlined,
    PrecisionManufacturing,
    PlayCircleFilledOutlined,
    Computer,
    TravelExploreOutlined,
    NightlifeOutlined,
    BrushOutlined,
    LanguageOutlined,
    MovieCreationOutlined,
    CampaignOutlined,
    PsychologyOutlined,
    Woman2Outlined,
    SetMealOutlined,
    ColorLensOutlined,
    QuizOutlined,
    EmojiEmotionsOutlined,
    BorderColorOutlined,
    AbcOutlined,
    SportsSoccerOutlined,
    VideogameAssetOutlined,
    EscalatorWarningOutlined,
    CameraEnhanceOutlined,
    PeopleOutlined,
} from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const IconsList = {
    "PetsOutlined": <PetsOutlined />,
    "Groups2Outlined": <Groups2Outlined />,
    "MovieCreationOutlined": <MovieCreationOutlined />,
    "MeetingRoomOutlined": <MeetingRoomOutlined />,
    "MicExternalOnOutlined": <MicExternalOnOutlined />,
    "EmojiEventsOutlined": <EmojiEventsOutlined />,
    "TransgenderOutlined": <TransgenderOutlined />,
    "CampaignOutlined": <CampaignOutlined />,
    "PsychologyOutlined": <PsychologyOutlined />,
    "Woman2Outlined": <Woman2Outlined />,
    "SetMealOutlined": <SetMealOutlined />,
    "PrecisionManufacturing": <PrecisionManufacturing />,
    "PlayCircleFilledOutlined": <PlayCircleFilledOutlined />,
    "Computer": <Computer />,
    "TravelExploreOutlined": <TravelExploreOutlined />,
    "NightlifeOutlined": <NightlifeOutlined />,
    "BrushOutlined": <BrushOutlined />,
    "LanguageOutlined": <LanguageOutlined />,

    
    // "EmojiEmotionsOutlined": <EmojiEmotionsOutlined />,
    // "AbcOutlined": <AbcOutlined />,
    // "RemoveOutlined": <RemoveOutlined />,
    // "SportsSoccerOutlined": <SportsSoccerOutlined />,
    // "ColorLensOutlined": <ColorLensOutlined />,
    // "VideogameAssetOutlined": <VideogameAssetOutlined />,
    // "PeopleOutlined": <PeopleOutlined />,
    // "QuizOutlined": <QuizOutlined />,
    // "EscalatorWarningOutlined": <EscalatorWarningOutlined />,
    // "CameraEnhanceOutlined": <CameraEnhanceOutlined />,
    // "TodayOutlined": <TodayOutlined />,
    // "BorderColorOutlined": <BorderColorOutlined />,
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
            <h5 className="vertical-timeline-element-subtitle">{location}</h5>
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
            <h5 className="vertical-timeline-element-subtitle">{location}</h5>
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
            <h5 className="vertical-timeline-element-subtitle">{location}</h5>
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
            <h5 className="vertical-timeline-element-subtitle">{location}</h5>
            <p>{description}</p>
        </VerticalTimelineElement>
    )
);

export default function EventsSchedule({eventsschedule}) {
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