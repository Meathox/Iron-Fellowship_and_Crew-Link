import { TrackStatus, TrackTypes } from "types/Track.type";
import { CharacterTracksSliceData } from "./characterTracks.slice.type";

export const defaultCharacterTracksSlice: CharacterTracksSliceData = {
  loadCompletedTracks: false,
  trackMap: {
    [TrackStatus.Active]: {
      [TrackTypes.Fray]: {},
      [TrackTypes.Journey]: {},
      [TrackTypes.Vow]: {},
      [TrackTypes.Clock]: {},
    },
    [TrackStatus.Completed]: {
      [TrackTypes.Fray]: {},
      [TrackTypes.Journey]: {},
      [TrackTypes.Vow]: {},
      [TrackTypes.Clock]: {},
    },
  },
  error: "",
  loading: false,
};
