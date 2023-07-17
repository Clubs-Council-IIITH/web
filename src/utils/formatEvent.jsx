import {
  audienceMap,
  audienceColorMap,
  stateMap,
  stateShortMap,
  stateColorMap,
  locationMap,
  stateIconMap,
} from "constants/events";

export function audienceLabels(audience) {
  return audience?.map((a) => ({
    name: audienceMap[a],
    color: audienceColorMap[a],
  }));
}

export function stateLabel(state) {
  return {
    name: stateMap[state],
    shortName: stateShortMap[state],
    color: stateColorMap[state],
    icon: stateIconMap[state],
  };
}

export function locationLabel(location) {
  return { name: locationMap[location] };
}
