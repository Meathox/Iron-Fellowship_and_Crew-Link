import { Asset } from "dataforged";
import { Unsubscribe } from "firebase/firestore";
import { AssetDocument } from "api-calls/assets/_asset.type";

export interface AssetSliceData {
  assets: { [key: string]: AssetDocument };
  loading: boolean;
  error?: string;
}

export interface AssetSliceActions {
  subscribe: (characterId: string) => Unsubscribe;

  addAsset: (asset: AssetDocument) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  updateAssetInput: (
    assetId: string,
    inputLabel: string,
    inputKey: string,
    inputValue: string
  ) => Promise<void>;
  updateAssetCheckbox: (
    assetId: string,
    abilityIndex: number,
    checked: boolean
  ) => Promise<void>;
  updateAssetTrack: (assetId: string, trackValue: number) => Promise<void>;
  updateCustomAsset: (assetId: string, asset: Asset) => Promise<void>;
  updateAssetCondition: (
    assetId: string,
    condition: string,
    checked: boolean
  ) => Promise<void>;

  updateAssetOption: (
    assetId: string,
    optionKey: string,
    value: string
  ) => Promise<void>;
  updateAssetControl: (
    assetId: string,
    controlKey: string,
    value: number | string | boolean
  ) => Promise<void>;

  resetStore: () => void;
}

export type AssetSlice = AssetSliceData & AssetSliceActions;
