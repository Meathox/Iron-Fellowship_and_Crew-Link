import { Datasworn } from "@datasworn/core";
import { useStore } from "stores/store";
import { OracleCollection as OracleCollectionRenderer } from "components/features/charactersAndCampaigns/OracleSection/OracleCollection";
import { CATEGORY_VISIBILITY } from "components/features/charactersAndCampaigns/OracleSection/useFilterOracles";

export interface OracleCollectionProps {
  collection: Datasworn.OracleTablesCollection;
}

export function OracleCollection(props: OracleCollectionProps) {
  const { collection } = props;

  const oracles = useStore((store) => store.rules.oracleMaps.oracleRollableMap);
  const collections = useStore(
    (store) => store.rules.oracleMaps.oracleCollectionMap
  );

  return (
    <OracleCollectionRenderer
      collectionId={collection._id}
      collections={collections}
      oracles={oracles}
      visibleCollections={{ [collection._id]: CATEGORY_VISIBILITY.ALL }}
      enhancesCollections={{}}
      visibleOracles={{}}
    />
  );
}
