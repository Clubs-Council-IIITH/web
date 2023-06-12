import { useState } from "react";
import { Typography, Grid, Container, Box, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Page from "components/Page";
import ClientOnly from "components/ClientOnly";
import { UserCard } from "components/users";
import ProgressList from "components/ProgressList";

import techMembers from "public/assets/json/techMembers.json";

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
            {value === index && (
                <Box sx={{ px: 1, pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function About() {
    const theme = useTheme();

    const [tabvalue, setTabValue] = useState(1);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Page title="Progress Report">
            <Container>
                <Typography variant="h3" gutterBottom align="center">
                    Progress Report
                </Typography>
                <Typography variant="h5" gutterBottom mt={4}>
                    Tech Team
                </Typography>

                <ClientOnly>
                    <Grid container spacing={3}>
                        {techMembers.map((user, key) => (
                            <Grid key={key} item xs={12} sm={6} md={3}>
                                <UserCard user={user} />
                            </Grid>
                        ))}
                    </Grid>
                </ClientOnly>

                <Box sx={{ mt: 3 }}>
                    <Tabs
                        value={tabvalue}
                        onChange={handleChange}
                        scrollButtons="auto"
                        textColor="black"
                        variant="scrollable"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: theme.palette.accent
                            }
                        }}
                        fullWidth
                    >
                        <Tab
                            label="Website v1 (Previous)"
                            sx={{
                                fontWeight: 600,
                                fontSize: "1.0em",
                                minWidth: "50%",
                                width: "50%"
                            }}
                            wrapped
                        />
                        <Tab
                            label="Website v2 (Current)"
                            sx={{
                                fontWeight: 600,
                                fontSize: "1.0em",
                                minWidth: "50%",
                                width: "50%"
                            }}
                            wrapped
                        />
                    </Tabs>
                </Box>

                <Box>
                    <TabPanel value={tabvalue} index={0}>
                        <Typography variant="body1" mt={1}>
                            Release Month: <i>August, 2022</i>
                        </Typography>
                        <ProgressList id="v1" />
                    </TabPanel>
                    <TabPanel value={tabvalue} index={1}>
                        <Typography variant="body1" mt={1}>
                        <u><a href="https://clubs.iiit.ac.in">Main Website</a></u> Release Month: <i>May, 2023</i>
                        </Typography>
                        <Typography variant="body1" mt={1}>
                            <u><a href="https://dev.clubs.iiit.ac.in">Dev Version</a></u> Release Month: <i>June, 2023</i> &nbsp; (Only on IIIT internal network)
                        </Typography>
                        <ProgressList id="v2" />
                    </TabPanel>
                </Box>

            </Container>
        </Page>
    );
}
