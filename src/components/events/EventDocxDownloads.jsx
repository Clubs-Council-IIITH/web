"use client";

import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    ImageRun,
    HorizontalPositionAlign,
    HorizontalPositionRelativeFrom,
    ExternalHyperlink
} from "docx";
import { PUBLIC_URL } from "utils/files";
import { formatDateTime } from "utils/formatTime";
import {
    locationLabel,
    audienceLabels
} from "utils/formatEvent";
import Icon from "components/Icon";

const LifeLogo = "/assets/life-logo-full-color-light.png";
const IIITLogo = "/assets/iiit-logo-color.png";
const CCLogo = "/assets/cc-logo-color.png";

export function DownloadEventReportDocx({
    event,
    eventReport,
    submittedUser,
    clubs,
}) {
    const submittedDate = formatDateTime(eventReport?.submittedTime);
    const startDate = event?.datetimeperiod ?
        formatDateTime(event.datetimeperiod[0]) :
        null;
    const endDate = event?.datetimeperiod ?
        formatDateTime(event.datetimeperiod[1]) :
        null;

    const fetchImageBuffer = async (url) => {
        const response = await fetch(url);
        return await response.arrayBuffer();
    };

    const generateDocx = async () => {
        const lifeLogoBuffer = await fetchImageBuffer(LifeLogo);
        const IIITLogoBuffer = await fetchImageBuffer(IIITLogo);
        const ccLogoBuffer = await fetchImageBuffer(CCLogo);

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: ccLogoBuffer,
                                transformation: {
                                    width: 100,
                                    height: 50
                                },
                                floating: {
                                    horizontalPosition: {
                                        offset: 414400,
                                    },
                                    verticalPosition: {
                                        offset: 414400,
                                    }
                                },
                            }),
                            new ImageRun({
                                data: lifeLogoBuffer,
                                transformation: {
                                    width: 110,
                                    height: 50
                                },
                                floating: {
                                    horizontalPosition: {
                                        align: HorizontalPositionAlign.CENTER,
                                    },
                                    verticalPosition: {
                                        offset: 414400,
                                    }
                                },
                            }),
                            new ImageRun({
                                data: IIITLogoBuffer,
                                transformation: {
                                    width: 110,
                                    height: 50
                                },
                                floating: {
                                    horizontalPosition: {
                                        relative: HorizontalPositionRelativeFrom.RIGHT_MARGIN,
                                        offset: -414400,
                                    },
                                    verticalPosition: {
                                        offset: 414400,
                                    }
                                },
                            }),
                        ],
                        alignment: "center",

                    }),
                    new Paragraph({
                        text: `Event Report: ${event?.name || "Unnamed Event"}`,
                        heading: "Heading1",
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Submitted On: ${submittedDate.dateString} ${submittedDate.timeString}`,
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        text: "Event Details",
                        heading: "Heading2",
                    }),
                    new Paragraph({
                        text: `Event Code: #${event?.code || "N/A"}`,
                    }),
                    new Paragraph({
                        text: `Organized By: ${clubs?.find((club) => club?.cid === event?.clubid)?.name || "N/A"
                            }`,
                    }),
                    new Paragraph({
                        text: `Collaborators: ${event?.collabclubs
                            ?.map((collab) => clubs?.find((club) => club?.cid === collab)?.name)
                            .join(", ") || "None"
                            }`,
                    }),
                    new Paragraph({
                        text: `Event Dates: ${startDate && endDate
                            ? `${startDate.dateString + " " + startDate.timeString + " IST"} to ${endDate.dateString + " " + endDate.timeString + " IST"}`
                            : "N/A"
                            }`,
                    }),
                    new Paragraph({
                        children: [
                            new ExternalHyperlink({
                                children: [
                                    new TextRun({
                                        text: `Event Link: ${PUBLIC_URL + "/events/" + event._id}`,
                                        style: "Hyperlink",
                                    }),
                                ],
                                link: `${PUBLIC_URL + "/events/" + event._id}`,
                            }),
                        ],
                    }),
                    new Paragraph({
                        text: "Budget Overview",
                        heading: "Heading2",
                    }),
                    event?.budget?.length ?
                        new Table({
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE
                            },
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph("Description")],
                                            width: {
                                                size: 50,
                                                type: WidthType.PERCENTAGE
                                            },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Amount")],
                                            width: {
                                                size: 25,
                                                type: WidthType.PERCENTAGE
                                            },
                                        }),
                                        new TableCell({
                                            children: [new Paragraph("Advance")],
                                            width: {
                                                size: 25,
                                                type: WidthType.PERCENTAGE
                                            },
                                        }),
                                    ],
                                }),
                                ...event.budget.map((item) =>
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [new Paragraph(item?.description || "Unknown")],
                                                width: {
                                                    size: 50,
                                                    type: WidthType.PERCENTAGE
                                                },
                                            }),
                                            new TableCell({
                                                children: [new Paragraph(item?.amount?.toString() || "Unknown")],
                                                width: {
                                                    size: 25,
                                                    type: WidthType.PERCENTAGE
                                                },
                                            }),
                                            new TableCell({
                                                children: [new Paragraph(item?.advance ? "Yes" : "No")],
                                                width: {
                                                    size: 25,
                                                    type: WidthType.PERCENTAGE
                                                },
                                            }),
                                        ],
                                    })
                                ),
                            ],
                        }) :
                        new Paragraph({
                            text: "No budget details available.",
                            italics: true,
                        }),

                    new Paragraph({
                        text: "Participation Overview",
                        heading: "Heading2",
                    }),
                    new Paragraph({
                        text: `Audience: ${event?.audience
                            ? audienceLabels(event?.audience).map(({ name }) => name).join(", ")
                            : "Unknown"
                            }`,
                    }),
                    new Paragraph({
                        text: `Estimated Participation: ${event?.population || "N/A"}`,
                    }),
                    new Paragraph({
                        text: `Actual Attendance: ${eventReport?.attendance || "N/A"}`,
                    }),

                    new Paragraph({
                        text: "Venue Information",
                        heading: "Heading2"
                    }),
                    new Paragraph({
                        text: `Mode: ${event?.mode ? event.mode.charAt(0).toUpperCase() + event.mode.slice(1) : "Unknown"}`
                    }),
                    ...(event?.location?.length ?
                        event.location.map((venue) =>
                            new Paragraph({
                                text: `${locationLabel(venue)?.name || "Unknown"}`,
                                bullet: {
                                    level: 0,
                                },
                            })
                        ) :
                        event?.mode !== 'online' ? [
                            new Paragraph({
                                text: "No venue information available.",
                                italics: true,
                                bullet: {
                                    level: 0,
                                },
                            })
                        ] : ""),

                    new Paragraph({
                        text: "Prizes",
                        heading: "Heading2"
                    }),
                    ...(eventReport?.prizes?.length ?
                        eventReport.prizes.map((prize) =>
                            new Paragraph({
                                text: prize.replace(/_/g, " ").toUpperCase(),
                                bullet: {
                                    level: 0,
                                },
                            })
                        ) :
                        [
                            new Paragraph({
                                text: "No Prizes.",
                                italics: true,
                                bullet: {
                                    level: 0,
                                },
                            })
                        ]),

                    ...(eventReport?.prizes?.length ?
                        [
                            new Paragraph({
                                text: 'Prizes Breakdown: ',
                                heading: "Heading3",
                            }),
                            ...(eventReport.prizesBreakdown ?
                                eventReport.prizesBreakdown.split("\n").map((line) =>
                                    new Paragraph({
                                        text: line.trim(),
                                    })
                                ) :
                                [
                                    new Paragraph({
                                        text: 'N/A',
                                    }),
                                ]),
                            new Paragraph({
                                text: 'Winners: ',
                                heading: "Heading3",
                            }),
                            ...(eventReport.winners ?
                                eventReport.winners.split("\n").map((line) =>
                                    new Paragraph({
                                        text: line.trim(),
                                    })
                                ) :
                                [
                                    new Paragraph({
                                        text: 'N/A',
                                    }),
                                ]),
                        ] :
                        []
                    ),

                    new Paragraph({
                        text: "Equipment",
                        heading: "Heading2"
                    }),
                    ...(event?.equipment ?
                        event?.equipment.split("\n").map((line) =>
                            new Paragraph({
                                text: line.trim(),
                            })
                        ) :
                        [new Paragraph({
                            text: "No equipment used.",
                            italics: true
                        })]),

                    new Paragraph({
                        text: "Additional Information",
                        heading: "Heading2"
                    }),
                    ...(event?.additional ?
                        event.additional.split("\n").map((line) =>
                            new Paragraph({
                                text: line.trim(),
                            })
                        ) :
                        [new Paragraph({
                            text: "No additional information available.",
                            italics: true
                        })]),

                    new Paragraph({
                        text: "Photos/Videos Link",
                        heading: "Heading2"
                    }),
                    new Paragraph({
                        children: [
                            new ExternalHyperlink({
                                children: [
                                    new TextRun({
                                        text: eventReport?.photosLink,
                                        style: "Hyperlink",
                                    }),
                                ],
                                link: eventReport?.photosLink,
                            }),
                        ],
                    }),

                    new Paragraph({
                        text: "Event Summary",
                        heading: "Heading2"
                    }),
                    ...(eventReport?.summary ?
                        eventReport.summary.split("\n").map((line) =>
                            new Paragraph({
                                text: line.trim(),
                            })
                        ) :
                        [new Paragraph({
                            text: "No summary provided.",
                            italics: true
                        })]),

                    new Paragraph({
                        text: "Feedback CC/College",
                        heading: "Heading2"
                    }),
                    ...(eventReport?.feedbackCc ?
                        eventReport.feedbackCc.split("\n").map((line) =>
                            new Paragraph({
                                text: line.trim(),
                            })
                        ) :
                        [new Paragraph({
                            text: "No feedback provided.",
                            italics: true
                        })]),

                    new Paragraph({
                        text: "Submitted By",
                        heading: "Heading2",
                    }),
                    new Paragraph({
                        text: `Name: ${`${submittedUser?.data?.firstName} ${submittedUser?.data?.lastName}` || "Unknown"
                            }`,
                    }),
                    new Paragraph({
                        text: `ID Number: ${submittedUser?.data?.rollno || "Unknown"}`,
                    }),
                    new Paragraph({
                        text: `Email: ${submittedUser?.data?.email || "Unknown"}`,
                    }),
                    new Paragraph({
                        text: `Phone Number: ${submittedUser?.data?.phone || "Unknown"}`,
                    }),
                ],
            },],
        });

        const buffer = await Packer.toBlob(doc);
        saveAs(buffer, `${
            event?.name?.replace(/\s+/g, "_")
            || "report"}_report.docx`
        );
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={generateDocx}
            startIcon={
                < Icon variant="download" />
            }
        >
            Report Doc
        </Button>
    );
}