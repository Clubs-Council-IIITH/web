import React from "react";
import { Container, Typography } from "@mui/material";
import ClubsTable from "components/buzz"; 
import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Manage Clubs",
};

export default async function ManageClubs() {
    // const event = await fetch(getStaticFile('json/buzz.json'));
    // const events = await event.json();
  const events = [
    {
        "eventName": "Hacking Club",
        "clubid": "hacking.club",
        "date": "02/11/23 - 04/11/23",
        "time": " - ",
        "venue": "Online"
    },
    {
        "eventName": "Gaming Club",
        "clubid": "thegamingclub",
        "date": "04/11/23 - Saturday",
        "time": "2:00 PM - 11:59 PM",
        "venue": "Bakul WareHouse"
    },
    {
        "eventName": "Decore",
        "clubid": "decore",
        "date": "04/11/23 - Saturday",
        "time": "2:00 PM - 4:00 PM",
        "venue": "(H-105/205)"
    },
    {
        "eventName": "Queer Club",
        "clubid": "queer.club",
        "date": "04/11/23 - Saturday",
        "time": "2:00 PM - 4:00 PM",
        "venue": "(H-105/SH-1/205/krb)"
    },
    {
        "eventName": "ARTSOC",
        "clubid": "chessclub",
        "date": "04/11/23 - Saturday",
        "time": "4:00 PM - 6:00 PM",
        "venue": "Amphitheater"
    },
    {
        "eventName": "Dance + Comedy",
        "clubid": "thedancecrew",
        "date": "04/11/23 - Saturday",
        "time": "6:00 PM - 11:59 PM",
        "venue": "Not mentioned"
    },
    {
        "eventName": "Programming Club",
        "clubid": "programming.club",
        "date": "05/11/23 - Sunday",
        "time": "11:00 AM to 1:00 PM",
        "venue": "Online"
    },
    {
        "eventName": "ASEC",
        "clubid": "sportsclub",
        "date": "05/11/23 - Sunday",
        "time": "11:00 AM to 1:00 PM",
        "venue": "Football Ground"
    },
    {
        "eventName": "Fashion Club",
        "clubid": "Fashion Club",
        "date": "05/11/23 - Sunday",
        "time": "2:00 PM to 4:00 PM",
        "venue": "Not mentioned"
    },
    {
        "eventName": "Chess Club",
        "clubid": "chessclub",
        "date": "05/11/23 - Sunday",
        "time": "2:00 PM to 6:00 PM",
        "venue": "D-101"
    },
    {
        "eventName": "Pentaprism",
        "clubid": "photography",
        "date": "05/11/23 - Sunday",
        "time": "3:00 PM to 6:00 PM",
        "venue": "Not mentioned"
    },
    {
        "eventName": "College Event",
        "clubid": "campuslife",
        "date": "05/11/23 - Sunday",
        "time": "3:00 PM to 6:00 PM",
        "venue": "H-105"
    },
    {
        "eventName": "Music + Dj",
        "clubid": "campuslife",
        "date": "05/11/23 - Sunday",
        "time": "6:00 PM to 11:59 PM",
        "venue": "Not mentioned"
    }
  ];
  const eventsWithIds = events.map((event, index) => ({
    ...event,
    id: index + 1 } ));
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Manage Clubs & Student Bodies
      </Typography>
      <ClubsTable clubs={eventsWithIds}/>
    </Container>
  );
}
