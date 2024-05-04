import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";
import { TrackStatus } from "types/Track.type";

export function useListenToCharacterTracks() {
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const loadCompletedTracks = useStore(
    (store) => store.characters.currentCharacter.tracks.loadCompletedTracks
  );
  const subscribe = useStore(
    (store) => store.characters.currentCharacter.tracks.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (characterId) {
      unsubscribe = subscribe(characterId);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [characterId, subscribe]);

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (characterId && loadCompletedTracks) {
      unsubscribe = subscribe(characterId, TrackStatus.Completed);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [characterId, subscribe, loadCompletedTracks]);
}
