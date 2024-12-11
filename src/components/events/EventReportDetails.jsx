"use client";

import { Box, Chip, Grid, Typography, Paper, Button, Divider, Stack, CardActionArea } from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";
import { jsPDF } from "jspdf";
import MemberListItem from "components/members/MemberListItem";
import EventBudget from "components/events/EventBudget";

import { locationLabel } from "utils/formatEvent";
const DateTime = dynamic(() => import("components/DateTime"), { ssr: false });

export function EventReportDetails({ event, eventReport, submittedUser }) {
    const formatDate = (date) =>
        new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata", // Adjust to the desired time zone
        }).format(new Date(date));
    const handleDownloadPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const maxWidth = pageWidth - 40;
        let yOffset = 20;

        const addTextWithPageBreak = (text, x, y) => {
            const lines = doc.splitTextToSize(text, maxWidth);
            const lineHeight = 6;
            const totalHeight = lines.length * lineHeight;

            if (y + totalHeight > pageHeight - 10) {
                doc.addPage();
                y = 20;
            }

            doc.text(lines, x, y);
            return y + totalHeight + 6;
        };
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(formatDate(eventReport?.submittedTime), pageWidth - 20, yOffset, { align: "right" });
        doc.setFontSize(18);
        yOffset = addTextWithPageBreak("Event Report", 20, yOffset);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const introText = `This report provides a detailed summary of the event conducted on behalf of ${event?.clubid}. Below are the key details and outcomes of the event.`;
        yOffset = addTextWithPageBreak(introText, 20, yOffset);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yOffset = addTextWithPageBreak("Event Details", 20, yOffset);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        yOffset = addTextWithPageBreak(`Event Name: ${event?.name || "Not Available"}`, 20, yOffset);

        if (event?.datetimeperiod) {
            const startDate = formatDate(event.datetimeperiod[0]);
            const endDate = formatDate(event.datetimeperiod[1]);
            yOffset = addTextWithPageBreak(`Event Dates: ${startDate} to ${endDate}`, 20, yOffset);
        } else {
            yOffset = addTextWithPageBreak("Event Dates: Not Available", 20, yOffset);
        }
        yOffset = addTextWithPageBreak(`Organized By: ${event?.clubid} ${event?.collabclubs?.length > 0 ? ` and collabs: ${event?.collabclubs?.join(", ")}` : ""}`, 20, yOffset);
        yOffset = addTextWithPageBreak(`Mode of Event: ${event?.mode || "Not Available"}`, 20, yOffset);

        yOffset += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yOffset = addTextWithPageBreak("Participation Overview", 20, yOffset);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        yOffset = addTextWithPageBreak(`Estimated Participation: ${event?.population || "Not Available"}`, 20, yOffset);
        yOffset = addTextWithPageBreak(`Actual Participation: ${eventReport?.attendance || "Not Available"}`, 20, yOffset);

        if (eventReport?.prizes?.length > 0) {
            yOffset += 2;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            yOffset = addTextWithPageBreak("Prizes and Winners", 20, yOffset);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            yOffset = addTextWithPageBreak("The following type(s) of prizes are awarded in the event:", 20, yOffset);
            eventReport?.prizes.forEach((prize) => {
                yOffset = addTextWithPageBreak(`- ${prize.replace(/_/g, " ").toUpperCase()}`, 20, yOffset);
            });

            yOffset = addTextWithPageBreak(`Prizes Breakdown: ${eventReport?.prizesBreakdown || "Not Available"}`, 20, yOffset);
        } else {
            yOffset = addTextWithPageBreak("No prizes awarded", 20, yOffset);
        }

        yOffset = addTextWithPageBreak(`Winners: ${eventReport?.winners || "Not Available"}`, 20, yOffset);

        if (event?.budget?.length > 0) {
            yOffset += 2;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            yOffset = addTextWithPageBreak("Budget Overview", 20, yOffset);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            event?.budget.forEach((item) => {
                yOffset = addTextWithPageBreak(`- Item: ${item?.description || "Unknown"} - Cost: ${item?.amount || "Unknown"}`, 20, yOffset);
            });
        } else {
            yOffset = addTextWithPageBreak("There is no budget for this event.", 20, yOffset);
        }

        if (event?.location?.length > 0) {
            yOffset += 2;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            yOffset = addTextWithPageBreak("Venue Information", 20, yOffset);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            event?.location.forEach((venue, index) => {
                yOffset = addTextWithPageBreak(`- Venue ${index + 1}: ${locationLabel(venue)?.name || "Unknown"}`, 20, yOffset);
            });
        } else {
            yOffset = addTextWithPageBreak("No venue information provided.", 20, yOffset);
        }

        yOffset += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yOffset = addTextWithPageBreak("Event Summary", 20, yOffset);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const summary = eventReport?.summary || "No summary available.";
        yOffset = addTextWithPageBreak(summary, 20, yOffset);

        yOffset += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yOffset = addTextWithPageBreak("Report Submitted By", 20, yOffset);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        yOffset = addTextWithPageBreak(`Submitted by: ${submittedUser?.data?.firstName + " " + submittedUser?.data?.lastName || "Unknown"}`, 20, yOffset);
        yOffset = addTextWithPageBreak(`Email: ${submittedUser?.data?.email || "Unknown"}`, 20, yOffset);
        yOffset = addTextWithPageBreak(`ID Number: ${submittedUser?.data?.rollno || "Unknown"}`, 20, yOffset);
        yOffset = addTextWithPageBreak(`Phone Number: ${submittedUser?.data?.phone || "Unknown"}`, 20, yOffset);

        yOffset += 2;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yOffset = addTextWithPageBreak("Feedback", 20, yOffset);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        yOffset = addTextWithPageBreak(`${eventReport?.feedbackCc || "No feedback available."}`, 20, yOffset);

        yOffset += 2;

        doc.setFontSize(10);
        doc.text("For more information, please contact the POC of the event.", 20, doc.internal.pageSize.height - 20);

        doc.save(`${event?.name?.replace(/ /g, "_") || "Event"}_Report.pdf`);
    };

    return (
        <>
            <Grid container>
                <Typography variant="h3" mt={1} mb={1}>
                    Event Report
                </Typography>
            </Grid>

            <Grid container spacing={6} >
                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                        Details
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="overline">Event Name</Typography>
                        <Typography variant="body2">{event?.name || "None"}</Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="overline">Organized By</Typography>
                        <Typography variant="body2">
                            <span>{event?.clubid}</span>
                            {event?.collabclubs.map((club, key) => (
                                <span key={key}>,{club}</span>
                            ))}
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="overline">Event Date</Typography>
                        <Typography variant="body2">
                            <DateTime dt={event?.datetimeperiod[0]} /> - <DateTime dt={event?.datetimeperiod[1]} />
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="overline">Report Submitted on</Typography>
                        <Typography variant="body2">
                            <DateTime dt={eventReport?.submittedTime} />
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                        Attendance
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="overline">Batches Participated</Typography>
                        <Typography variant="body2">
                            {event?.audience?.join(", ") || "None"}
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="overline">Mode</Typography>
                        <Typography variant="body2">{event?.mode || "None"}</Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="overline">Estimated Population</Typography>
                        <Typography variant="body2">{event?.population || 0}</Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="overline">Attended Population</Typography>
                        <Typography variant="body2">{eventReport?.attendance || "None"}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                        Prizes
                    </Typography>
                    {eventReport?.prizes?.length > 0 && (
                        <>
                            <Box mt={2}>
                                {eventReport?.prizes.map((prize, key) => (
                                    <Chip key={key} label={prize.replace(/_/g, " ").toUpperCase()} sx={{ mr: 1, mb: 1, p: 1 }} />
                                ))}
                            </Box>
                            <Box mt={2}>
                                <Typography variant="overline">Prizes Breakdown</Typography>
                                <Typography variant="body2">{eventReport?.prizesBreakdown || "None"}</Typography>
                            </Box>
                        </>
                    )}
                    <Box mt={2}>
                        <Typography variant="overline">Winners</Typography>
                        <Typography variant="body2">{eventReport?.winners || "None"}</Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="overline">Photos/Videos Link</Typography>
                        <Typography variant="body2"><a style={{ color: "inherit", textDecoration: "none" }} href={eventReport?.photosLink} target="_blank" rel="noreferrer">{eventReport?.photosLink || "None"}</a></Typography>
                    </Box>
                </Grid>
            </Grid>

            <Grid item xs={12} mt={3}>
                <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                    Summary of the event held
                </Typography>
                <Box mt={2}>
                    <Typography variant="body2">{eventReport?.summary || "None"}</Typography>
                </Box>
            </Grid>

            <Divider sx={{ borderStyle: "dashed", my: 2 }} />

            <Grid container spacing={6}>
                <Grid item xs={12} lg={7}>
                    <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                        Budget
                    </Typography>
                    {event?.budget?.length ? (
                        <EventBudget rows={event?.budget.map((b, key) => ({ ...b, id: b?.id || key }))} editable={false} />
                    ) : (
                        <Box mt={2}>None requested</Box>
                    )}
                </Grid>

                <Grid item xs={12} lg={5}>
                    <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                        Venue
                    </Typography>
                    {event?.location?.length ? (
                        <>
                            <Box mt={2}>
                                {event?.location.map((venue, key) => (
                                    <Chip key={key} label={locationLabel(venue)?.name} sx={{ mr: 1, mb: 1, p: 1 }} />
                                ))}
                            </Box>
                            <Box mt={2}>
                                <Typography variant="overline">Equipment</Typography>
                                <Typography variant="body2">{event?.equipment || "None"}</Typography>
                            </Box>
                            <Box mt={2}>
                                <Typography variant="overline">Additional Information</Typography>
                                <Typography variant="body2">{event?.additional || "None"}</Typography>
                            </Box>
                        </>
                    ) : (
                        <Box mt={2}>None requested</Box>
                    )}
                </Grid>
            </Grid>

            <Grid container spacing={6}>
                <Grid item xs={12} lg={7} mt={3}>
                        <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                            Report Submitted By
                        </Typography>
                        <CardActionArea component={Link} href={`/profile/${eventReport?.submittedBy}`} sx={{ textDecoration: "none", maxWidth: "max-content" }}>
                            <MemberListItem uid={eventReport?.submittedBy} />
                        </CardActionArea>
                        <Typography variant="body2" color="text.secondary">
                            ID No: {submittedUser?.data?.rollno || "None"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Phone Number: {submittedUser?.data?.phone || "None"}
                        </Typography>
                        <Grid item xs={12} mt={2}>
                            <Typography variant="subtitle2" textTransform="uppercase" gutterBottom>
                                Feedback
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {eventReport?.feedbackCc || "None"}
                            </Typography>
                        </Grid>
                </Grid>
                <Grid item xs={12} lg={5} display="flex" justifyContent="flex-start" alignItems="flex-end" mb={2}>
                    <Box mt={4}>
                        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>Download Report as PDF</Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
