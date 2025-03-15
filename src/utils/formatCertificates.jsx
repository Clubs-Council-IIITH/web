"use client";

import {
    stateMap,
    stateColorMap,
    stateIconMap,
} from "constants/certificates";

export function stateLabel(state) {
    return {
        name: stateMap[state],
        color: stateColorMap[state],
        icon: stateIconMap[state],
    };
}