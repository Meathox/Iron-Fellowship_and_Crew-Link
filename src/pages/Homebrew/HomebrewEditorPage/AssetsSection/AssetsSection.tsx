import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/material";
import { SectionHeading } from "components/shared/SectionHeading";
import { useState } from "react";
import { AssetCollectionsList } from "./AssetCollections/AssetCollectionsList";
import { AssetCollectionDialog } from "./AssetCollections/AssetCollectionDialog";
import { useStore } from "stores/store";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { AssetDialog } from "./Assets/AssetDialog";

export interface AssetsSectionProps {
  homebrewId: string;
}

export function AssetsSection(props: AssetsSectionProps) {
  const { homebrewId } = props;

  const [assetCollectionDialogState, setAssetCollectionDialogState] = useState<{
    open: boolean;
    collectionId?: string;
  }>({ open: false });
  const [assetDialogState, setAssetDialogState] = useState<{
    open: boolean;
    assetId?: string;
  }>({ open: false });

  const assetCollections = useStore(
    (store) =>
      store.homebrew.collections[homebrewId]?.assetCollections?.data ?? {}
  );
  const [openCollectionKey, setOpenCollectionKey] = useState<string>();
  const openCollection =
    assetCollections && openCollectionKey
      ? assetCollections[openCollectionKey]
      : undefined;

  return (
    <Stack spacing={2} mt={2}>
      {openCollectionKey && openCollection ? (
        <>
          <Breadcrumbs>
            <Link
              component={"button"}
              underline='hover'
              color='inherit'
              sx={{ lineHeight: "1rem" }}
              onClick={() => setOpenCollectionKey(undefined)}
            >
              Asset Collections
            </Link>
            <Typography color='text.primary'>{openCollection.label}</Typography>
          </Breadcrumbs>
          <SectionHeading
            label={"Collection Info"}
            floating
            action={
              <Button
                color={"inherit"}
                onClick={() =>
                  setAssetCollectionDialogState({
                    open: true,
                    collectionId: openCollectionKey,
                  })
                }
              >
                Edit Collection
              </Button>
            }
          />
          {openCollection.description && (
            <MarkdownRenderer markdown={openCollection.description} />
          )}
          <SectionHeading
            label={"Collection Assets"}
            floating
            action={
              <Button
                color={"inherit"}
                onClick={() =>
                  setAssetDialogState({
                    open: true,
                  })
                }
              >
                Create Asset
              </Button>
            }
          />
        </>
      ) : (
        <>
          <SectionHeading
            label={"Homebrew Asset Collections"}
            floating
            action={
              <Button
                variant={"outlined"}
                color={"inherit"}
                onClick={() => setAssetCollectionDialogState({ open: true })}
              >
                Add Asset Collection
              </Button>
            }
          />
          <AssetCollectionsList
            homebrewId={homebrewId}
            openCreateAssetCollectionDialog={() =>
              setAssetCollectionDialogState({ open: true })
            }
            setOpenCollection={setOpenCollectionKey}
          />
        </>
      )}
      <AssetCollectionDialog
        open={assetCollectionDialogState.open}
        onClose={() => setAssetCollectionDialogState({ open: false })}
        homebrewId={homebrewId}
        existingAssetCollectionId={assetCollectionDialogState.collectionId}
      />
      <AssetDialog
        open={assetDialogState.open}
        onClose={() => setAssetDialogState({ open: false })}
        homebrewId={homebrewId}
        existingAssetId={assetDialogState.assetId}
      />
    </Stack>
  );
}
