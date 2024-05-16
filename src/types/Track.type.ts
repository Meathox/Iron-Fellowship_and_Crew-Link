import { AskTheOracle } from "config/system.config";
import { Timestamp } from "firebase/firestore";

export enum TrackTypes {
  Vow = "vow",
  Journey = "journey",
  Fray = "fray",
  BondProgress = "bondProgress",
  Clock = "clock",
}

export type ProgressTracks =
  | TrackTypes.BondProgress
  | TrackTypes.Fray
  | TrackTypes.Journey
  | TrackTypes.Vow;
export type TrackSectionProgressTracks =
  | TrackTypes.Fray
  | TrackTypes.Journey
  | TrackTypes.Vow;
export type TrackSectionTracks = TrackSectionProgressTracks | TrackTypes.Clock;

export enum TrackStatus {
  Active = "active",
  Completed = "completed",
}

export enum Difficulty {
  Troublesome = "troublesome",
  Dangerous = "dangerous",
  Formidable = "formidable",
  Extreme = "extreme",
  Epic = "epic",
}

export interface BaseTrack {
  label: string;
  type: TrackSectionTracks;
  description?: string;
  value: number;
  status: TrackStatus;
  createdDate: Date;
}

export interface BaseTrackDocument extends Omit<BaseTrack, "createdDate"> {
  createdTimestamp: Timestamp;
}

export interface ProgressTrack extends BaseTrack {
  difficulty: Difficulty;
}

export interface Clock extends BaseTrack {
  segments: number;
  oracleKey?: AskTheOracle;
}

export type Track = ProgressTrack | Clock;
