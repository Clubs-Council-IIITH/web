const audienceMap = {
    ug1: { name: "UG1", color: "info" },
    ug2: { name: "UG2", color: "success" },
    ug3: { name: "UG3", color: "warning" },
    ugx: { name: "UG4+", color: "error" },
    pg: { name: "PG", color: "primary" },
    faculty: { name: "Faculty", color: "common.grey" },
};

export function fToList(audienceString) {
    var audienceList = audienceString?.split(",") || [];
    return audienceList.map((a) => audienceMap[a]);
}
