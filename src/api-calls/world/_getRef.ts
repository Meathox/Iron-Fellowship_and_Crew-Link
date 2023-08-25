import { firestore } from "config/firebase.config";
import {
  Bytes,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import {
  decodeDataswornId,
  encodeDataswornId,
} from "functions/dataswornIdEncoder";
import { EncodedWorld, Truth, TRUTH_IDS, World } from "types/World.type";

export function constructWorldsPath() {
  return `/worlds`;
}

export function constructWorldDocPath(worldId: string) {
  return `/worlds/${worldId}`;
}

export function getWorldCollection() {
  return collection(
    firestore,
    constructWorldsPath()
  ) as CollectionReference<EncodedWorld>;
}

export function getWorldDoc(worldId: string) {
  return doc(
    firestore,
    constructWorldDocPath(worldId)
  ) as DocumentReference<EncodedWorld>;
}

export function encodeWorld(world: World): EncodedWorld {
  const { truths: decodedTruths, worldDescription, ...remainingWorld } = world;

  const encodedTruths: { [key: string]: Truth } = {};

  Object.keys(decodedTruths).forEach((truthId) => {
    encodedTruths[encodeDataswornId(truthId)] =
      world.truths[truthId as TRUTH_IDS];
  });

  const encodedWorld: EncodedWorld = {
    ...remainingWorld,
    truths: encodedTruths,
  };

  if (worldDescription) {
    encodedWorld.worldDescription = Bytes.fromUint8Array(worldDescription);
  }

  return encodedWorld;
}

export function decodeWorld(encodedWorld: EncodedWorld): World {
  const {
    truths: encodedTruths,
    worldDescription,
    ...remainingWorld
  } = encodedWorld;
  const decodedTruths: { [key: string]: Truth } = {};

  Object.keys(encodedTruths).forEach((encodedTruthId) => {
    decodedTruths[decodeDataswornId(encodedTruthId) as TRUTH_IDS] =
      encodedWorld.truths[encodedTruthId];
  });

  const world: World = {
    ...remainingWorld,
    worldDescription: worldDescription?.toUint8Array(),
    truths: decodedTruths as { [key in TRUTH_IDS]: Truth },
  };

  return world;
}