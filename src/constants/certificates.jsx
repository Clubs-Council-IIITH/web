// State
export const stateMap = {
    incomplete: "Draft",
    pending_cc: "CC Pending",
    pending_slc: "SLC Pending",
    pending_slo: "SLO Pending",
    approved: "Approved",
    rejected: "Rejected",
};

export const stateColorMap = {
    incomplete: "secondary",
    pending_cc: "warning",
    pending_slc: "warning",
    pending_slo: "warning",
    approved: "success",
    rejected: "error",
};

export const stateIconMap = {
    incomplete: "eva:alert-circle-outline",
    pending_cc: "eva:refresh-outline",
    pending_slc: "eva:refresh-outline",
    pending_slo: "eva:refresh-outline",
    approved: "eva:checkmark-outline",
    rejected: "eva:close-outline",
};