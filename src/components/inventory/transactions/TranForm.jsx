"use client";

import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const defaultItems = [
  { _id: "1", name: "Projector" },
  { _id: "2", name: "Speaker" },
  { _id: "3", name: "Mic Kit" },
];

const defaultEvents = [
  { _id: "e1", name: "Annual Day" },
  { _id: "e2", name: "Orientation" },
];

export default function TransactionForm({
  defaultValues = {},
  items = defaultItems,
  events = defaultEvents,
  pocs = defaultPocs,
  onSubmit = () => {},
  submitLabel = "Submit Request",
}) {
  const [loading, setLoading] = useState(false);

  const normalizedDefaults = useMemo(
    () => ({
      itemids: [],
      quantity: 1,
      startDate: "",
      endDate: "",
      useEvent: false,
      eventid: "",
      purpose: "",
      pickupLocation: "",
      storageLocation: "",
      poc: "",
      remarks: "",
      ...defaultValues,
    }),
    [defaultValues],
  );

  const { control, handleSubmit, watch } = useForm({
    defaultValues: normalizedDefaults,
    mode: "onChange",
  });

  const useEvent = watch("useEvent");

  const submit = async (formData) => {
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit(submit)}>
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ textTransform: "uppercase" }}>
              Request Details
            </Typography>
            <Divider />
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Controller
                name="itemids"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="transaction-items-label">Items</InputLabel>
                    <Select
                      {...field}
                      multiple
                      labelId="transaction-items-label"
                      label="Items"
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((itemId) => (
                            <Chip
                              key={itemId}
                              label={items.find((item) => item._id === itemId)?.name ?? itemId}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {items.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          <Checkbox checked={field.value.includes(item._id)} />
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Quantity"
                    type="number"
                    inputProps={{ min: 1 }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
          </Grid>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ textTransform: "uppercase" }}>
              Request Context
            </Typography>
            <Divider />
          </Box>

          <Controller
            name="useEvent"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Link this request to an event"
              />
            )}
          />

          {useEvent ? (
            <Controller
              name="eventid"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="transaction-event-label">Event</InputLabel>
                  <Select {...field} labelId="transaction-event-label" label="Event">
                    {events.map((event) => (
                      <MenuItem key={event._id} value={event._id}>
                        {event.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          ) : (
            <Controller
              name="purpose"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth label="Purpose / reason" multiline minRows={3} />}
            />
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="poc"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="transaction-poc-label">Point of contact</InputLabel>
                    <Select {...field} labelId="transaction-poc-label" label="Point of contact">
                      {pocs.map((poc) => (
                        <MenuItem key={poc.uid} value={poc.uid}>
                          {poc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Remarks" />}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {submitLabel}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}