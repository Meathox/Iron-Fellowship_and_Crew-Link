/* eslint-disable @typescript-eslint/no-unused-vars */
import { getSystem } from "hooks/useGameSystem";
import {
  ironswornAssetCategories,
  starforgedAssetCategories,
} from "./dataforged";
import type {
  AssetType,
  ConditionMeter,
  Asset as DataforgedAsset,
  MeterCondition,
} from "dataforged";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

import { Datasworn } from "@datasworn/core";
import { parseAssetsIntoMaps } from "stores/rules/helpers/parseAssetsIntoMaps";
import { capitalize } from "@mui/material";

const gameSystem = getSystem();
const assetCategories: GameSystemChooser<typeof ironswornAssetCategories> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornAssetCategories,
  [GAME_SYSTEMS.STARFORGED]: starforgedAssetCategories,
};

// NEW ASSETS START HERE
export const assetGroupMap: { [key: string]: AssetType } = {};
export const assetMap: { [key: string]: DataforgedAsset } = {};
export const assetTypeLabels: { [key: string]: string } = {
  "ironsworn/assets/role": "Role",
  "starforged/assets/role": "Role",
};

Object.values(assetCategories[gameSystem]).forEach((category) => {
  assetGroupMap[category.$id] = category;
  assetTypeLabels[category.$id] = category.Title.Standard;
  Object.values(category.Assets).forEach((asset) => {
    assetMap[asset.$id] = asset;
  });
});

export const assetGroups = Object.values(assetCategories[gameSystem]);

const oldIronswornAssets: Record<string, DataforgedAsset> = {};

Object.values(ironswornAssetCategories).forEach((category) => {
  assetTypeLabels[category.$id] = category.Title.Standard;
  Object.values(category.Assets).forEach((asset) => {
    oldIronswornAssets[asset.$id] = asset;
  });
});

const oldStarforgedAssets: Record<string, DataforgedAsset> = {};
Object.values(starforgedAssetCategories).forEach((category) => {
  assetTypeLabels[category.$id] = category.Title.Standard;
  Object.values(category.Assets).forEach((asset) => {
    oldStarforgedAssets[asset.$id] = asset;
  });
});

export function getNewDataswornId(oldId: string): string {
  return oldId.replace("ironsworn", "classic").replaceAll("-", "_");
}
export function getOldDataswornId(newId: string): string {
  const exemptIronswornKeys = [
    "classic/assets/companion/cave_lion",
    "classic/assets/companion/giant_spider",
    "classic/assets/companion/young_wyvern",
    "classic/assets/path/animal_kin",
    "classic/assets/path/fortune_hunter",
  ];
  if (newId.startsWith("classic") && !exemptIronswornKeys.includes(newId)) {
    const assetKey = newId
      .substring(newId.lastIndexOf("/"))
      .replaceAll("_", "-");
    const convertedId = newId.substring(0, newId.lastIndexOf("/")) + assetKey;
    return convertedId.replace("classic", "ironsworn");
  }
  return newId.replace("classic", "ironsworn");
}
export function getNewConditionMeterKey(conditionMeter: ConditionMeter) {
  return conditionMeter.Label.replace("companion health", "health");
}
function getNewConditionMeterConditionKey(
  meterCondition: MeterCondition
): string {
  return meterCondition.replaceAll(" ", "_");
}
export function getNewInputKey(
  assetId: string,
  inputKey: string
): string | null {
  if (assetId === "classic/assets/combat_talent/ironclad") {
    return null;
  }
  const newInputKey = inputKey
    .toLocaleLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("'", "")
    .replaceAll("-", "_")
    .replaceAll("/", "_");

  if (newInputKey === "linked_stat" && assetId.startsWith("classic")) {
    return "stat";
  }
  // if (
  //   (newInputKey === "name" &&
  //     assetId.startsWith("starforged/assets/companion") &&
  //     assetId !== "starforged/assets/companion/sidekick") ||
  //   assetId.startsWith("starforged/assets/command_vehicle") ||
  //   assetId === "starforged/assets/deed/homesteader"
  // ) {
  //   return "label";
  // }

  return newInputKey;
}
export function getOldInputKey(inputKey: string): string {
  let oldInputKey = capitalize(inputKey);

  oldInputKey = oldInputKey.replaceAll("_", "").replaceAll("_", "-");

  if (inputKey === "stat") {
    return "Linked stat";
  }

  // Specific issues
  if (oldInputKey === "Godsname") {
    return "God's name";
  } else if (oldInputKey === "Titlelineage") {
    return "Title/Lineage";
  } else if (oldInputKey === "Linkedstat") {
    return "Linked stat";
  } else if (oldInputKey === "Lastof") {
    return "Last of";
  } else if (oldInputKey === "Bondmate") {
    return "Bond-mate";
  }

  return oldInputKey;
}

export function getNewControlKey(inputKey: string): string {
  return inputKey
    .toLocaleLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("'", "")
    .replaceAll("-", "_")
    .replaceAll("/", "_");
}

const compareAssets = (
  oldAssets: Record<string, DataforgedAsset>,
  newAssets: Record<string, Datasworn.Asset>
) => {
  Object.keys(oldAssets).forEach((oldAssetKey) => {
    const newAssetKey = getNewDataswornId(oldAssetKey);
    const doubleConvertedNewAssetKey = getNewDataswornId(newAssetKey);
    const convertedOldAssetKey = getOldDataswornId(newAssetKey);
    const doubleConvertedOldAssetKey = getOldDataswornId(convertedOldAssetKey);
    if (!newAssets[newAssetKey]) {
      // console.debug("Missing asset", oldAssetKey);
      return;
    }
    if (!oldAssets[convertedOldAssetKey]) {
      console.debug("OLD ASSET KEY CONVERSION DID NOT WORK");
      console.debug("OLD ASSET KEY", oldAssetKey);
      console.debug("CONVERTED OLD ASSET KEY", convertedOldAssetKey);
    }
    if (doubleConvertedOldAssetKey !== convertedOldAssetKey) {
      console.debug(
        "DOUBLE CONVERTING OLD ASSET KEY DID NOT WORK",
        convertedOldAssetKey,
        doubleConvertedOldAssetKey
      );
    }
    if (doubleConvertedNewAssetKey !== newAssetKey) {
      console.debug(
        "DOUBLE CONVERTING NEW ASSET KEY DID NOT WORK",
        newAssetKey,
        doubleConvertedNewAssetKey
      );
    }
    const oldAsset = oldAssets[oldAssetKey];
    const newAsset = newAssets[newAssetKey];

    if (oldAsset["Condition meter"]) {
      const newControls = newAsset.controls;
      if (!newControls) {
        console.debug("NEW ASSET DOES NOT HAVE CONTROLS");
      } else {
        const newConditionMeterKey = getNewConditionMeterKey(
          oldAsset["Condition meter"]
        );

        // Check for condition meter in new asset
        const newConditionMeter = newControls[newConditionMeterKey];
        if (
          !newConditionMeter ||
          newConditionMeter.field_type !== "condition_meter"
        ) {
          console.debug("NEW ASSET DOES NOT HAVE CONDITION METER");
        } else if (oldAsset["Condition meter"].Conditions?.length > 0) {
          // Check that the condition meter has the same conditions attached
          oldAsset["Condition meter"].Conditions.forEach((condition) => {
            const conditionMeterConditionKey =
              getNewConditionMeterConditionKey(condition);
            if (!newConditionMeter.controls) {
              console.debug(
                "NEW CONDITION METER DID NOT HAVE ASSOCIATED CONTROLS"
              );
            } else if (
              !newConditionMeter.controls[conditionMeterConditionKey]
            ) {
              console.debug(
                `CONDITION METER CONTROL ${conditionMeterConditionKey} DID NOT EXIST`
              );
              console.debug(newConditionMeter.controls);
            }
          });
        }
      }
    }

    if (oldAsset.Inputs) {
      Object.keys(oldAsset.Inputs).forEach((inputKey) => {
        const oldInput = oldAsset.Inputs?.[inputKey];

        const newInputKey = getNewInputKey(newAsset._id, inputKey);

        if (newInputKey === null) {
          const newControlKey = getNewControlKey(inputKey);
          if (!newAsset.controls) {
            console.debug("NEW ASSET DOES NOT HAVE CONTROLS");
          } else if (!newAsset.controls[newControlKey]) {
            console.debug("NO INPUT AVAILABLE IN CONTROLS", newControlKey);
          }
          const oldControlKey = getOldInputKey(newControlKey);
          if (!oldAsset.Inputs?.[oldControlKey]) {
            console.debug(`MISSING ${oldControlKey}`);
          }
        } else if (!newAsset.options) {
          console.debug("NEW ASSET DOES NOT HAVE OPTIONS", oldInput, newAsset);
        } else {
          const newInput = newAsset.options[newInputKey];
          if (!newInput) {
            console.debug(newAsset._id, `MISSING INPUT ${newInputKey}`);
          }
        }
        if (newInputKey) {
          const oldInputKey = getOldInputKey(newInputKey);
          if (!oldAsset.Inputs?.[oldInputKey]) {
            console.debug("MISSING OLD INPUT", inputKey, oldInputKey);
          }
        }
      });
    }
  });
};

// console.debug("COMPARING IRONSWORN ASSETS");
// compareAssets(oldIronswornAssets, newIronswornAssets);
// console.debug("COMPARING STARFORGED ASSETS");
// compareAssets(oldStarforgedAssets, newStarforgedAssets);

// Asset Diff
/**
starforged/assets/path/crew_commander
starforged/assets/companion/the_kraken
starforged/assets/deed/cohort 
starforged/assets/deed/fleet_commander
 */
