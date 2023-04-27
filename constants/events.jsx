// event audience
export const audienceMap = {
    ug1: "UG 1",
    ug2: "UG 2",
    ug3: "UG 3",
    ug4: "UG 4+",
    pg: "PG",
    stf: "Staff",
    fac: "Faculty",
};

export const audienceColorMap = {
    ug1: "info",
    ug2: "success",
    ug3: "warning",
    ug4: "error",
    pg: "primary",
    stf: "common.grey",
    fac: "common.grey",
};

// event venue
export const locationMap = {
    H101: "Himalaya 101",
    H102: "Himalaya 102",
    H103: "Himalaya 103",
    H104: "Himalaya 104",
    H201: "Himalaya 201",
    H202: "Himalaya 202",
    H203: "Himalaya 203",
    H204: "Himalaya 204",
    H301: "Himalaya 301",
    H302: "Himalaya 302",
    H303: "Himalaya 303",
    H304: "Himalaya 304",
    VA3_117: "Vindhya A3 117",
    VSH1: "Vindhya SH1",
    VSH2: "Vindhya SH2",
    AMPI: "Amphitheatre",
    CIEg: "CIE Gaming",
    SARG: "Saranga Hall",
    H105: "Himalaya 105",
    H205: "Himalaya 205",
    KRBa: "KRB Auditorium",
    LM22: "LM-22, KRB",
    SM24: "SM-24, KRB",
    SM32: "SM-32, KRB",
    LM34: "LM-34, KRB",
    D101: "D101, T-Hub",
    other: "Other",
};

// event status.state
export const stateMap = {
    incomplete: "Incomplete",
    pending_cc: "Pending Clubs Council Approval",
    pending_budget: "Pending Budget Approval",
    pending_room: "Pending Room Approval",
    approved: "Approved",
    completed: "Completed",
    deleted: "Deleted",
};

export const stateShortMap = {
    incomplete: "Incomplete",
    pending_cc: "CC Pending",
    pending_budget: "Budget Pending",
    pending_room: "Room Pending",
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
    completed: "primary",
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
