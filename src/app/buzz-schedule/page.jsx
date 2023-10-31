"use client";
import { Typography, Button, Container, Box, Tabs, Tab, Divider } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { forwardRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import EventsSchedule from "components/buzz/eventsschedule";

const Page = forwardRef(({ children, title = "", meta, ...other }, ref) => (
  <>
    <Head>
      <title>{`${title}`}</title>
      {meta}
    </Head>

    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

Page.displayName = "Page";
Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default async function Induction() {
  const theme = useTheme();
  const eventsschedule = [
    {
      "className": "date"
    },
    {

        "className":"red",
        "eventName": "Hacking Club",
        "clubid": "hacking.club",
        "date": "02/11/23 - 04/11/23",
        "time": " - ",
        "location": "Online",
        "icon":"TerminalOutlined"
    },
    {
        "className":"blue",
        "eventName": "Gaming Club",
        "clubid": "thegamingclub",
        "date": "04/11/23 - Saturday",
        "time": "2:00 PM - 11:59 PM",
        "location": "Bakul WareHouse",
        "icon":"VideogameAssetOutlined"
    },
    {
        "className":"pink",
        "eventName": "Decore",
        "clubid": "decore",
        "date": "04/11/23 - Saturday",
        "time": "2:00 PM - 4:00 PM",
        "location": "(H-105/205)",
        "icon":"panorama"
    },
    {
        "className":"green",
        "eventName": "Queer Club",
        "clubid": "queer.club",
        "date": "04/11/23 - Saturday",
        "time": "2:00 PM - 4:00 PM",
        "location": "(H-105/SH-1/205/krb)",
        "icon":"TransgenderOutlined"
    },
    {
        "className":"red",
        "eventName": "ARTSOC",
        "clubid": "chessclub",
        "date": "04/11/23 - Saturday",
        "time": "4:00 PM - 6:00 PM",
        "location": "Amphitheater",
        "icon":"arttrack"
    },
    {
        "className":"blue",
        "eventName": "Dance + Comedy",
        "clubid": "thedancecrew",
        "date": "04/11/23 - Saturday",
        "time": "6:00 PM - 11:59 PM",
        "location": "Not mentioned",
        "icon":"MicExternalOnOutlined"
    },
    {
      "className": "date"
    },
    {
        "className":"green",
        "eventName": "Programming Club",
        "clubid": "programming.club",
        "date": "05/11/23 - Sunday",
        "time": "11:00 AM to 1:00 PM",
        "location": "Online",
        "icon":"Computer"
    },
    {
        "className":"pink",
        "eventName": "ASEC",
        "clubid": "sportsclub",
        "date": "05/11/23 - Sunday",
        "time": "11:00 AM to 1:00 PM",
        "location": "Football Ground",
        "icon":"SportsSoccerOutlined"
    },
    {
        "className":"blue",
        "eventName": "Fashion Club",
        "clubid": "Fashion Club",
        "date": "05/11/23 - Sunday",
        "time": "2:00 PM to 4:00 PM",
        "location": "Not mentioned",
        "icon":""
    },
    {
        "className":"green",
        "eventName": "Chess Club",
        "clubid": "chessclub",
        "date": "05/11/23 - Sunday",
        "time": "2:00 PM to 6:00 PM",
        "location": "D-101",
        "icon":""
    },
    {
        "className":"red",
        "eventName": "Pentaprism",
        "clubid": "photography",
        "date": "05/11/23 - Sunday",
        "time": "3:00 PM to 6:00 PM",
        "location": "Not mentioned",
        "icon":"CameraEnhanceOutlined"
    },
    {
        "className":"green",
        "eventName": "College Event",
        "clubid": "campuslife",
        "date": "05/11/23 - Sunday",
        "time": "3:00 PM to 6:00 PM",
        "location": "H-105",
        "icon":"CampaignOutlined"
    },
    {
        "className":"pink",
        "eventName": "Music + Dj",
        "clubid": "campuslife",
        "date": "05/11/23 - Sunday",
        "time": "6:00 PM to 11:59 PM",
        "location": "Not mentioned",
        "icon":"NightlifeOutlined"
    },
    {
      "className": "date"
    },
    {
      "className": "empty"
    },
    
  ];
  return (
    <Page title="Felicity Buzz">
      <Container>
        <Typography variant="h3" gutterBottom align="center">
          Felicity Buzz
        </Typography>
        <Typography variant="body1" gutterBottom mt={4} align="center">
          Organised by <i>Clubs Council</i> & <i>Felicity</i>, in partnership with Clubs on Campus
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Tabs
            value={0}
            scrollButtons="auto"
            textColor="black"
            variant="scrollable"
            TabIndicatorProps={{
              style: {
                backgroundColor: theme.palette.accent,
              },
            }}
            sx={{ backgroundColor: alpha(theme.palette.accent, 0.07) }}
            fullWidth
          >
            <Tab
              label="Events Schedule"
              sx={{
                fontWeight: 600,
                fontSize: "1.0em",
                minWidth: "100%",
                width: "100%",
              }}
              wrapped
            />
            
          </Tabs>
        </Box>
            <Box sx={{ mt: 3 }}>
              {
                // environment && environment === 'production' ?
                //   <Typography variant="body1"> To be announced soon !<br />Stay Tuned !!</Typography>
                //   :
                  !eventsschedule ? <Typography variant="body1">Loading...</Typography>
                    : <EventsSchedule eventsschedule={eventsschedule} />
              }
            </Box>
      </Container>
    </Page>
  );
}
