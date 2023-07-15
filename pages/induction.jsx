import { useState } from "react";
import { Typography, Grid, Container, Box, Tabs, Tab, Divider } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

import Page from "components/Page";

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

  const [tabvalue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Page title="Induction '23">
      <Container>
        <Typography variant="h3" gutterBottom align="center">
          Induction 2023
        </Typography>
        <Typography variant="body1" gutterBottom mt={4} align="center">
          Organised by <i>Clubs Council</i> & <i>Apex</i>, in partnership with all Student Bodies and Clubs on Campus
        </Typography>

        <Box sx={{ mt: 3 }}>
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
            <Typography variant="body1" mt={1}>
              Schedule Comes here
            </Typography>
          </TabPanel>
          <TabPanel value={tabvalue} index={2}>
            <Typography variant="body1" mt={1}>
              Intro to Clubs Sequence comes here
            </Typography>
          </TabPanel>
        </Box>
      </Container>
    </Page>
  );
}
