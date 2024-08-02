"use client";

import {
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ISOtoHuman } from "utils/formatTime";

export default function EventsDialog({
  open,
  onClose,
  events = [],
  clubs = [],
}) {
  console.log(clubs);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Clashing Events</DialogTitle>
      <Box
        sx={{
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        <List>
          {events.map((event) => (
            <ListItem key={event.id}>
              <ListItemText
                primary={event.name}
                secondary={
                  <div>
                    <div>
                      By {clubs.find((club) => club.cid === event.clubid)?.name}
                    </div>
                    <div>
                      {ISOtoHuman(event.datetimeperiod[0])} to{" "}
                      {ISOtoHuman(event.datetimeperiod[1])}
                    </div>
                    <div>
                      <b>Status:</b> {event.status.state === "approved" 
                      ? "Approved" 
                      : event.status.state === "incomplete" 
                      ? "Draft" 
                      : "Under review"}
                    </div>
                  </div>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
