import { useState, useEffect } from "react";
import Link from "next/link";
import { Typography, Button, Container, Box, Tabs, Tab, Divider } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useTheme, alpha } from "@mui/material/styles";

import Page from "components/Page";
import EventsSchedule from "components/induction/eventsschedule";
import IntroToClubs from "components/induction/introtoclubs";

// import introtoclubsschedule from "public/assets/json/introtoclubsschedule.json";
// import introtoclubsschedule_pg from "public/assets/json/introtoclubsschedule-pg.json";
// import eventsschedule from "public/assets/json/eventsschedule.json";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ px: 1, pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Induction() {
  const theme = useTheme();
  const environment = process.env.NEXT_PUBLIC_ENV;

  const [tabvalue, setTabValue] = useState(0);
  const [introtabvalue, setIntroTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleIntroChange = (event, newValue) => {
    setIntroTabValue(newValue);
  };

  const [eventsschedule, setEventsSchedule] = useState(null);
  useEffect(() => {
    fetch("/static/eventsschedule.json")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setEventsSchedule(data)
      })
  }, []);

  const [introtoclubsschedule, setIntroToClubsSchedule] = useState(null);
  useEffect(() => {
    fetch("/static/introtoclubsschedule.json")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setIntroToClubsSchedule(data)
      })
  }, [eventsschedule]);

  const [introtoclubsschedule_pg, setIntroToClubsSchedulePG] = useState(null);
  useEffect(() => {
    fetch("/static/introtoclubsschedule-pg.json")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setIntroToClubsSchedulePG(data)
      })
  }, [eventsschedule]);

  return (
    <Page title="Induction '23">
      <Container>
        <Typography variant="h3" gutterBottom align="center">
          Induction 2023
        </Typography>
        <Typography variant="body1" gutterBottom mt={4} align="center">
          Organised by <i>Clubs Council</i> & <i>Apex</i>, in partnership with all Student Bodies and Clubs on Campus
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            component={Link}
            href="https://apexbody.github.io/"
            target="_blank"
            color="primary"
            variant="outlined"
            sx={{ p: 1 }}
            style={{ border: '2px solid' }}
            endIcon={<SendIcon />}
          >
            View Student&apos;s Kit 2023-24
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Tabs
            value={tabvalue}
            onChange={handleChange}
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
                minWidth: "50%",
                width: "50%",
              }}
              wrapped
            />
            <Divider
              orientation="vertical"
              style={{
                height: 35,
                alignSelf: "center",
                color: alpha(theme.palette.accent, 0.6),
              }}
            />
            <Tab
              label="Intro to Clubs"
              sx={{
                fontWeight: 600,
                fontSize: "1.0em",
                minWidth: "50%",
                width: "50%",
              }}
              wrapped
            />
          </Tabs>
        </Box>

        <Box>
          <TabPanel value={tabvalue} index={0}>
            <Box sx={{ mt: 3 }}>
              {
                // environment && environment === 'production' ?
                //   <Typography variant="body1"> To be announced soon !<br />Stay Tuned !!</Typography>
                //   :
                  !eventsschedule ? <Typography variant="body1">Loading...</Typography>
                    : <EventsSchedule eventsschedule={eventsschedule} />
              }
            </Box>
          </TabPanel>
          <TabPanel value={tabvalue} index={2}>
            {/* <Typography variant="body1" mt={1}>
              Intro to Clubs Sequence comes here
            </Typography> */}
            {
              // environment && environment === 'production' ?
              //   <Typography variant="body1" sx={{ mt: 3 }}> To be announced soon !<br />Stay Tuned !!</Typography>
              //   :
                <>
                  <Divider
                    style={{
                      color: "black"
                    }} />
                  <Box sx={{ mt: 1.5 }}>
                    <Tabs
                      value={introtabvalue}
                      onChange={handleIntroChange}
                      scrollButtons="auto"
                      textColor="black"
                      variant="scrollable"
                      TabIndicatorProps={{
                        style: {
                          backgroundColor: theme.palette.accent_opp,
                        },
                      }}
                      sx={{ backgroundColor: alpha(theme.palette.accent_opp, 0.07) }}
                      fullWidth
                    >
                      <Tab
                        label="UG 2k23"
                        sx={{
                          fontWeight: 600,
                          fontSize: "1.0em",
                          minWidth: "50%",
                          width: "50%",
                        }}
                        wrapped
                      />
                      <Divider
                        orientation="vertical"
                        style={{
                          height: 35,
                          alignSelf: "center",
                          color: alpha(theme.palette.accent_opp, 0.6),
                        }}
                      />
                      <Tab
                        label="LE 2k23, PG 2k23 & PhD 2k23"
                        sx={{
                          fontWeight: 600,
                          fontSize: "1.0em",
                          minWidth: "50%",
                          width: "50%",
                        }}
                        wrapped
                      />
                    </Tabs>
                  </Box>
                  <Box>
                    <TabPanel value={introtabvalue} index={0}>
                      <Box sx={{ mt: 3 }}>
                        {!introtoclubsschedule ? <Typography variant="body1">Loading...</Typography> :
                          <IntroToClubs jsonfile={introtoclubsschedule} />}
                      </Box>
                    </TabPanel>
                    <TabPanel value={introtabvalue} index={2}>
                      <Box sx={{ mt: 3 }}>
                        {!introtoclubsschedule_pg ? <Typography variant="body1">Loading...</Typography> :
                          <IntroToClubs jsonfile={introtoclubsschedule_pg} />}
                      </Box>
                    </TabPanel>
                  </Box>
                </>
            }
          </TabPanel>
        </Box>
      </Container>
    </Page>
  );
}
