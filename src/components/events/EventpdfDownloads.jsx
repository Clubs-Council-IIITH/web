"use client";

import { Button } from "@mui/material";

import {
  Document,
  Page,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";

import { PUBLIC_URL } from "utils/files";
import { formatDateTime, ISOtoHuman } from "utils/formatTime";
import { locationLabel, stateLabel, billsStateLabel, audienceLabels } from "utils/formatEvent";

const LifeLogo = "/assets/life-logo-full-color-light.png";
const IIITLogo = "/assets/iiit-logo-color.png";
const CCLogo = "/assets/cc-logo-color.png"

export function DownloadEventReport({
  event,
  eventReport,
  submittedUser,
  clubs,
}) {
  const submittedDate = formatDateTime(eventReport?.submittedTime);
  const startDate = event?.datetimeperiod
    ? formatDateTime(event.datetimeperiod[0])
    : null;
  const endDate = event?.datetimeperiod
    ? formatDateTime(event.datetimeperiod[1])
    : null;
  const htmlContent = `
    <style>

        h1,
        h2,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .report-container {
            margin-top: -40px;
            margin-bottom: -10mm;
            width: 100%;
            max-width: 800px;
            padding: 20px;
            box-sizing: border-box;
        }

        h1 {
            color: red;
            font-size: 24px;
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 2px solid red;
            padding-bottom: 5px;
        }

        h2 {
            color: #333;
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }

        p, a {
            font-size: 13px;
            line-height: 1.6;
            margin: 8px 0;
        }

        strong {
            font-weight: bold;
        }

        ul {
            margin-left: 20px;
            list-style-type: disc;
        }

        li {
            font-size: 13px;
            margin-bottom: 5px;
        }

        .section {
            margin-bottom: 15px;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #888;
        }

        .no-data {
            color: #888;
            font-style: italic;
        }

        .submitted-by {
            font-weight: bold;
        }

        .email,
        .idno,
        .phone {
            font-style: italic;
            color: #444;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table,
        th,
        td {
            border: 1px solid #ddd;
        }

        th,
        td {
            font-size: 13px;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            text-align: center;
        }
    </style>
    <div class="report-container">
        <h1>Event Report: ${event?.name || "Unnamed Event"}</h1>
        <p><strong>Submitted On:</strong> ${submittedDate.dateString} ${
    submittedDate.timeString
  }</p>

        <div class="section">
            <h2>Event Details</h2>
            <p><strong>Event Code:</strong> #${event?.code || "N/A"}</p>
            <p><strong>Organized By:</strong> ${
              clubs?.find((club) => club?.cid === event?.clubid)?.name || "N/A"
            }</p>
            <p><strong>Collaborators:</strong> ${
              event?.collabclubs
                ?.map(
                  (collab) => clubs?.find((club) => club?.cid === collab)?.name
                )
                .join(", ") || "None"
            }</p>
            <p><strong>Event Dates:</strong> ${
              startDate && endDate
                ? `${startDate.dateString + " " + startDate.timeString}
                to ${endDate.dateString + " " + endDate.timeString}`
                : "N/A"
            }</p>
            <p><strong>Event Link:</strong> <a href="${
              PUBLIC_URL + "/events/" + event._id
            }">${PUBLIC_URL + "/events/" + event._id}</a></p>
        </div>

        <div class="section">
            <h2>Budget Overview</h2>
            ${
              event?.budget?.length
                ? `
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="adv">Amount</th>
                        <th class="adv">Advance</th>
                    </tr>
                </thead>
                <tbody>
                    ${event.budget
                      .map(
                        (item) => `
                    <tr>
                        <td>${item?.description || "Unknown"}</td>
                        <td class="adv">${item?.amount || "Unknown"}</td>
                        <td class="adv">${
                          item?.advance == true ? "Yes" : "No"
                        }</td>
                    </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
            `
                : `<p class="no-data">No budget details available.</p>`
            }
        </div>
        
        <div class="section">
            <h2>Participation Overview</h2>
            <p><strong>Audience:</strong> ${
              event?.audience
                ? audienceLabels(event?.audience).map(({ name, color }) => name).join(", ")
                : "Unknown"
            }</p>
            <p><strong>Estimated Participation:</strong> ${
              event?.population || "N/A"
            }</p>
            <p><strong>Actual Attendance:</strong> ${
              eventReport?.attendance || "N/A"
            }</p>
        </div>
        <div class="section">
            <h2>Venue Information</h2>
            <p><strong>Mode:</strong> ${
              event?.mode
                ? event.mode.charAt(0).toUpperCase() + event.mode.slice(1)
                : "Unknown"
            }</p>
            ${
              event?.mode !== "online"
                ? event?.location?.length
                  ? `
                  <p>Locations:</p>
                    <ul>
                        ${event.location
                          .map(
                            (venue) =>
                              `<li>${
                                locationLabel(venue)?.name || "Unknown"
                              }</li>`
                          )
                          .join("")}
                    </ul>
                    `
                  : `<p class="no-data">No venue information available.</p>`
                : ""
            }
        </div>

        <div class="section">
            <h2>Prizes</h2>
            ${
              eventReport?.prizes?.length
                ? `
            <ul>
                ${eventReport.prizes
                  .map(
                    (prize) =>
                      `<li>${prize.replace(/_/g, " ").toUpperCase()}</li>`
                  )
                  .join("")}
            </ul>
            <p><strong>Prizes Breakdown:</strong> ${
                eventReport?.prizesBreakdown
                  ? eventReport?.prizesBreakdown.replace(/\n/g, "<br />") // Handling line breaks
                  : "N/A"
              }</p>
              <p><strong>Winners:</strong> ${
                eventReport?.winners
                  ? eventReport?.winners.replace(/\n/g, "<br />") // Handling line breaks
                  : "N/A"
              }</p>`
                : `<p class="no-data">No prizes awarded.</p>`
            }
        </div>

        ${
          event?.equipment
            ? `
        <div class="section">
            <h2>Equipment</h2>
            <p>${event?.equipment}</p>
        </div>
        `
            : ""
        }
        ${
          event?.additional
            ? `
        <div class="section">
            <h2>Additional Information</h2>
            <p>${event?.additional}</p>
        </div>
        `
            : ""
        }
        <div class="section">
            <h2>Photos/Videos Link</h2>
            <a href="${eventReport?.photosLink}">${eventReport?.photosLink}</a>
        </div>
        <div class="section">
            <h2>Event Summary</h2>
            <p>${eventReport?.summary || "No summary provided."}</p>
        </div>

        <div class="section">
            <h2>Feedback</h2>
            <p>${eventReport?.feedbackCc || "No feedback available."}</p>
        </div>

        <div class="section">
            <h2>Submitted By</h2>
            <p class="submitted-by">${
              `${submittedUser?.data?.firstName} ${submittedUser?.data?.lastName}` ||
              "Unknown"
            }</p>
            <p class="idno"><strong>ID Number:</strong> ${
              submittedUser?.data?.rollno || "Unknown"
            }</p>
            <p class="email"><strong>Email:</strong> ${
              submittedUser?.data?.email || "Unknown"
            }</p>
            <p class="phone"><strong>Phone Number:</strong> ${
              submittedUser?.data?.phone || "Unknown"
            }</p>

        </div>

        <div class="footer">
            <p>Report Generated on ${ISOtoHuman(
              new Date().toISOString(),
              false,
              true,
              true
            )}</p>
        </div>
    </div>
    `;
  const styles = StyleSheet.create({
    page: {
      padding: "10mm", // Set margins to 10mm for all sides
    },
    headerContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "5mm", // Space after the header
    },
    logo1: {
      width: 80,
      height: "auto",
    },
    logo2: {
      width: 90,
      height: "auto",
    },
    logo3: {
      width: 110,
      height: "auto",
    },
  });

  const pdfDoc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <div style={styles.headerContainer}>
          <Image src={CCLogo} style={styles.logo1} />
          <Image src={LifeLogo} style={styles.logo2} />
          <Image src={IIITLogo} style={styles.logo3} />
        </div>
        <Html>{htmlContent}</Html>
      </Page>
    </Document>
  );
  return (
    <PDFDownloadLink document={pdfDoc} fileName={`${event?.name.replace(/\s+/g, "_")}_report.pdf`}>
      <Button variant="contained" color="primary">
        Download Report PDF
      </Button>
    </PDFDownloadLink>
  );
}

export function DownloadEvent({ event, clubs, pocProfile }) {
  const startDate = event?.datetimeperiod
    ? formatDateTime(event.datetimeperiod[0])
    : null;
  const endDate = event?.datetimeperiod
    ? formatDateTime(event.datetimeperiod[1])
    : null;
  const htmlContent = `
    <style>
        h1,
        h2,
        p,
        ul,
        li {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .report-container {
            margin-top: -40px;
            margin-bottom: -10mm;
            width: 100%;
            max-width: 800px;
            padding: 20px;
            box-sizing: border-box;
        }

        h1 {
            color: red;
            font-size: 24px;
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 2px solid red;
            padding-bottom: 5px;
        }

        h2 {
            color: #333;
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }

        p, a {
            font-size: 13px;
            line-height: 1.6;
            margin: 8px 0;
        }

        strong {
            font-weight: bold;
        }

        ul {
            margin-left: 20px;
            list-style-type: disc;
        }

        li {
            font-size: 13px;
            margin-bottom: 5px;
        }

        .section {
            margin-bottom: 15px;
        }

        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #888;
        }

        .no-data {
            color: #888;
            font-style: italic;
        }

        .submitted-by {
            font-weight: bold;
        }

        .email,
        .idno,
        .phone {
            font-style: italic;
            color: #444;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table,
        th,
        td {
            border: 1px solid #ddd;
        }

        th,
        td {
            font-size: 12px;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            text-align: center;
        }

        .adv{
            width: 50px;
        }
    </style>
    <div class="report-container">
        <h1>${event?.name || "Unnamed Event"}</h1>

        <div class="section">
            <h2>Event Details</h2>
            <p><strong>Event Code:</strong> #${event?.code || "N/A"}</p>
            <p><strong>Organized By:</strong> ${clubs?.find((club) => club?.cid === event?.clubid)?.name || "N/A"}</p>
            <p><strong>Collaborating Clubs/Bodies:</strong> ${
              event?.collabclubs
                ?.map(
                  (collab) => clubs?.find((club) => club?.cid === collab)?.name
                )
              .join(", ") || "None"
            }</p>
            <p><strong>Event Dates:</strong> ${
              startDate && endDate
                ? `${startDate.dateString + " " + startDate.timeString + " IST"}
                to ${endDate.dateString + " " + endDate.timeString + " IST"}`
                : "N/A"
            }</p>
            <p><strong>Current Status: </strong> ${
              stateLabel(event?.status?.state)?.name || "N/A"
            }</p>
            <p><strong>Description:</strong> ${
              event?.description || "N/A"
            }</p>
        </div>

        <div class="section">
                <h2>Budget Overview</h2>
                ${
                  event?.budget?.length
                    ? `
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th class="adv">Amount</th>
                            <th class="adv">Advance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${event.budget
                          .map(
                            (item) => `
                        <tr>
                            <td>${item?.description || "Unknown"}</td>
                            <td class="adv">${item?.amount || "Unknown"}</td>
                            <td class="adv">${
                              item?.advance == true ? "Yes" : "No"
                            }</td>
                        </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
                `
                    : `<p class="no-data">No budget details available.</p>`
                }
        </div>
        <div class="section">
            <h2>Venue Information</h2>
            <p><strong>Mode:</strong> ${
              event?.mode
                ? event.mode.charAt(0).toUpperCase() + event.mode.slice(1)
                : "Unknown"
            }</p>
            <p><strong>Audience:</strong> ${
              event?.audience
                ? audienceLabels(event?.audience).map(({ name, color }) => name).join(", ")
                : "Unknown"
            }</p>
            <p><strong>Estimated Participation:</strong> ${
              event?.population || "N/A"
            }</p>
            ${
              event?.mode !== "online"
                ? event?.location?.length
                  ? `
                  <p>Locations:</p>
                    <ul>
                        ${event.location
                          .map(
                            (venue) =>
                              `<li>${
                                locationLabel(venue)?.name || "Unknown"
                              }</li>`
                          )
                          .join("")}
                    </ul>
                    `
                  : `<p class="no-data">No venue information available.</p>`
                : ""
            }
        </div>

        ${
          event?.equipment
            ? `
        <div class="section">
                <h2>Equipment</h2>
                <p>${event?.equipment}</p>
        </div>
        `
            : ""
        }
        ${
          event?.additional
            ? `
        <div class="section">
                <h2>Additional Information</h2>
                <p>${event?.additional}</p>
        </div>
        `
            : ""
        }

        <div class="section">
            <h2>POC of Event</h2>
            <p class="submitted-by">${
              `${pocProfile?.data?.firstName} ${pocProfile?.data?.lastName}` ||
              "Unknown"
            }</p>
            <p class="idno"><strong>ID Number:</strong> ${
              pocProfile?.data?.rollno || "Unknown"
            }</p>   
            <p class="email"><strong>Email:</strong> ${
              pocProfile?.data?.email || "Unknown"
            }</p>
            <p class="phone"><strong>Phone Number:</strong> ${
              pocProfile?.data?.phone || "Unknown"
            }</p>
        </div>
            
        <div class="section">
        <h2>Timeline</h2>
        <p><strong>Last Edited:</strong> ${
          event?.status?.lastUpdatedTime
            ? event?.status?.lastUpdatedTime
            : "Information not available"
        }</p>
        <p><strong>Last Edited By:</strong> ${
          event?.lastEditeduser || "Information not available"
        }</p>

        ${
          event?.status?.state === "deleted"
            ? `
                <p><strong>Event Deletion:</strong> ${
                  event?.status?.deletedTime
                    ? event?.status?.deletedTime
                    : "Information not available"
                }</p>
                <p><strong>Event Deleted By:</strong> ${
                  event?.deletedBy || "Information not available"
                }</p>
                `
            : ""
        }
        ${
          event?.status?.state !== "incomplete"
            ? `
        <p><strong>Event Submission:</strong> ${
          event?.status?.submissionTime
            ? event?.status?.submissionTime
            : "Information not available"
        }</p>
        <p><strong>Clubs Council Approval:</strong> ${
          event?.status?.ccApproverTime
            ? event?.status?.ccApproverTime
            : "Information not available"
        }</p>
        <p><strong>Clubs Council Approved By:</strong> ${
          event?.status?.ccApprover || "Information not available"
        }</p>
        
        <p><strong>Students Life Council Approval:</strong> ${
          event?.status?.slcApproverTime
            ? event?.status?.slcApproverTime
            : "Information not available"
        }</p>
        <p><strong>Students Life Office Approval:</strong> ${
          event?.status?.sloApproverTime
            ? event?.status?.sloApproverTime
            : "Information not available"
        }</p>
        `
            : ""
        }
        </div>
            
        ${
          event?.budget?.length
            ? `
        <div class="section">
            <h2>Bill Status</h2>

            <!-- Checking if bill status is available -->
            ${
              event?.billStatus
                ? `
            <div>
                <h3>Bill Information</h3>
                <p><strong>Bills Status:</strong> ${
                  event?.billStatus?.state == null
                    ? "Information not available"
                    : billsStateLabel(event?.billStatus?.state)?.name
                }</p>
                <p><strong>Last Updated:</strong> ${
                  event?.billStatus?.updatedTime || "Information not available"
                }</p>
                <p><strong>SLO Comment:</strong> ${
                  event?.billStatus?.sloComment || "-"
                }</p>
            </div>
            `
                : `<p class="no-data">Bill status details not available.</p>`
            }
            </div>`
            : ""
        }

        <div class="footer">
            <p>Event PDF Generated on ${ISOtoHuman(
              new Date().toISOString(),
              false,
              true,
              true
            )}</p>
        </div>
    </div>
    `;

  const styles = StyleSheet.create({
    page: {
      padding: "10mm", // Set margins to 10mm for all sides
    },
    headerContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "5mm",
    },
    logo1: {
      width: 80,
      height: "auto",
    },
    logo2: {
      width: 90,
      height: "auto",
    },
    logo3: {
      width: 110,
      height: "auto",
    }
  });

  const pdfDoc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <div style={styles.headerContainer}>
          <Image src={CCLogo} style={styles.logo1} />
          <Image src={LifeLogo} style={styles.logo2} />
          <Image src={IIITLogo} style={styles.logo3} />
        </div>
        <Html>{htmlContent}</Html>
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink document={pdfDoc} fileName={`${event?.name.replace(/\s+/g, "_")}.pdf`}>
      <Button variant="contained" color="primary">
        Download Event PDF
      </Button>
    </PDFDownloadLink>
  );
}
