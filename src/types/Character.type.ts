import { StoredAsset } from "./Asset.type";
import { LegacyTrack } from "./LegacyTrack.type";

export type StatsMap = {
  [key: string]: number;
};

export enum INITIATIVE_STATUS {
  HAS_INITIATIVE = "initiative",
  DOES_NOT_HAVE_INITIATIVE = "noInitiative",
  OUT_OF_COMBAT = "outOfCombat",
}

export interface CharacterDocument {
  uid: string;
  name: string;
  stats: StatsMap;
  health: number;
  spirit: number;
  supply: number;
  adds?: number;
  momentum: number;
  campaignId?: string;
  experience?: {
    earned?: number;
    spent?: number;
  };
  legacyTracks?: {
    quests?: LegacyTrack;
    bonds?: LegacyTrack;
    discoveries?: LegacyTrack;
  };
  bonds?: number;
  debilities?: {
    [key: string]: boolean;
  };
  initiativeStatus?: INITIATIVE_STATUS;
  shareNotesWithGM?: boolean;
  profileImage?: {
    filename: string;
    position: {
      x: number;
      y: number;
    };
    scale: number;
  };
  worldId?: string | null;

  customTracks?: {
    [trackName: string]: number;
  };
}

export interface AssetDocument {
  assetOrder: string[];
  assets: {
    [key: string]: StoredAsset;
  };
}
