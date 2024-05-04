import { CharacterDocument } from "api-calls/character/_character.type";
import { AssetSlice } from "./assets/assets.slice.type";
import { CharacterTracksSlice } from "./tracks/characterTracks.slice.type";
import { UpdateData } from "firebase/firestore";

export interface CurrentCharacterSliceData {
  currentCharacterId?: string;
  momentumResetValue?: number;
  currentCharacter?: CharacterDocument;
}
export interface CurrentCharacterSliceActions {
  setCurrentCharacterId: (characterId?: string) => void;

  updateCurrentCharacter: (
    character: UpdateData<CharacterDocument>
  ) => Promise<void>;
  updateCharacterConditionMeter: (
    conditionMeterKey: string,
    value: number
  ) => Promise<void>;
  updateCurrentCharacterPortrait: (
    portrait: File | undefined,
    scale: number,
    position: { x: number; y: number }
  ) => Promise<void>;
  removeCurrentCharacterPortrait: () => Promise<void>;

  resetStore: () => void;
}

export type CurrentCharacterSlice = CurrentCharacterSliceData &
  CurrentCharacterSliceActions & {
    assets: AssetSlice;
    tracks: CharacterTracksSlice;
  };
