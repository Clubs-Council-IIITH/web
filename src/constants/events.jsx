// event audience
export const audienceMap = {
  ug1: "UG 1",
  ug2: "UG 2",
  ug3: "UG 3",
  ug4: "UG 4+",
  pg: "PG",
  stf: "Staff",
  fac: "Faculty",
  internal: "Internal",
};

export const audienceColorMap = {
  ug1: "info",
  ug2: "success",
  ug3: "warning",
  ug4: "error",
  pg: "secondary",
  stf: "common.grey",
  fac: "common.grey",
  internal: "secondary",
};

// event venue
export const locationMap = {
  h101: "Himalaya 101",
  h102: "Himalaya 102",
  h103: "Himalaya 103",
  h104: "Himalaya 104",
  h201: "Himalaya 201",
  h202: "Himalaya 202",
  h203: "Himalaya 203",
  h204: "Himalaya 204",
  h301: "Himalaya 301",
  h302: "Himalaya 302",
  h303: "Himalaya 303",
  h304: "Himalaya 304",
  va3_117: "Vindhya A3 117",
  vsh1: "Vindhya SH1",
  vsh2: "Vindhya SH2",
  amphi: "Amphitheatre",
  warehouse: "Bakul Warehouse",
  cieg: "CIE Gaming",
  sarg: "Saranga Hall",
  felig: "Felicity Ground",
  footg: "Football Ground",
  guest: "Guest House",
  h105: "Himalaya 105",
  h205: "Himalaya 205",
  krba: "KRB Auditorium",
  lm22: "LM-22, KRB",
  sm24: "SM-24, KRB",
  sm32: "SM-32, KRB",
  lm34: "LM-34, KRB",
  d101: "D101, T-Hub",
  other: "Other",
};

// event status.state
export const stateMap = {
  incomplete: "Incomplete",
  pending_cc: "Pending Clubs Council Approval",
  pending_budget: "Pending SLC Approval",
  pending_room: "Pending SLO Approval",
  approved: "Approved",
  completed: "Completed",
  deleted: "Deleted",
};

export const stateShortMap = {
  incomplete: "Draft",
  pending_cc: "CC Pending",
  pending_budget: "SLC Pending",
  pending_room: "SLO Pending",
  approved: "Approved",
  completed: "Completed",
  deleted: "Deleted",
};

export const stateColorMap = {
  incomplete: "secondary",
  pending_cc: "warning",
  pending_budget: "warning",
  pending_room: "warning",
  approved: "success",
  completed: "info",
  deleted: "error",
};

export const stateIconMap = {
  incomplete: "eva:alert-circle-outline",
  pending_cc: "eva:refresh-outline",
  pending_budget: "eva:refresh-outline",
  pending_room: "eva:refresh-outline",
  approved: "eva:checkmark-outline",
  completed: "eva:checkmark-circle-outline",
  deleted: "eva:close-outline",
};

export const billsStateMap = {
  not_submitted: "Not Submitted",
  incomplete: "Incomplete",
  submitted: "Submitted",
  slo_processed: "Processed by SLO",
};

export const billsStateColorMap = {
  not_submitted: "error",
  incomplete: "warning",
  submitted: "info",
  slo_processed: "success",
};

export const billsStateIconMap = {
  not_submitted: "eva:alert-circle-outline",
  incomplete: "eva:refresh-outline",
  submitted: "eva:checkmark-outline",
  slo_processed: "eva:checkmark-circle-outline",
};
