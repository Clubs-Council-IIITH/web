// const audienceMap = {
//     ug1: { name: "UG1", color: "info" },
//     ug2: { name: "UG2", color: "success" },
//     ug3: { name: "UG3", color: "warning" },
//     ugx: { name: "UG4+", color: "error" },
//     pg: { name: "PG", color: "primary" },
//     faculty: { name: "Faculty", color: "common.grey" },
// };

// export function fToList(audienceString) {
//     var audienceList = audienceString?.split(",") || [];
//     return audienceList.map((a) => audienceMap[a]);
// }

const audienceColormap = {
    // "UG 1": "info",
    // "UG 2": "success",
    // "UG 3": "warning",
    // "UG 4+": "error",
    // PG: "primary",
    // Staff: "common.grey",
    // Faculty: "common.grey",

    // TODO: return mapped audience labels from server
    ug1: "info",
    ug2: "success",
    ug3: "warning",
    ug4: "error",
    pg: "primary",
    stf: "common.grey",
    fac: "common.grey",
};

export function audienceLabels(audience) {
    return audience?.map((a) => ({ name: a, color: audienceColormap[a] }));
}
