import { Alert, Grid, Typography } from "@mui/material";
import { truthIds } from "data/truths";
import { TRUTH_IDS, World } from "types/World.type";
import { RichTextEditorNoTitle } from "./RichTextEditor";
import { SectionHeading } from "./SectionHeading";
import { WorldNameSection } from "pages/World/WorldSheetPage/components/WorldNameSection";
import { TruthCard } from "pages/World/WorldSheetPage/components/TruthCard";
import { useStore } from "stores/store";

export interface WorldSheetProps {
  world: World;
  canEdit: boolean;
  hideCampaignHints?: boolean;
}

export function WorldSheet(props: WorldSheetProps) {
  const { world, canEdit, hideCampaignHints } = props;

  const updateWorldDescription = useStore(
    (store) => store.worlds.currentWorld.updateCurrentWorldDescription
  );

  return (
    <>
      {canEdit ? (
        <WorldNameSection />
      ) : (
        <Typography
          variant={"h5"}
          sx={(theme) => ({ py: 2, fontFamily: theme.fontFamilyTitle })}
        >
          {world.name}
        </Typography>
      )}
      {(canEdit || world.description) && (
        <>
          <SectionHeading
            breakContainer
            label={"World Description"}
            sx={{ mt: canEdit ? 4 : 0, mb: 2 }}
          />
          {canEdit && !hideCampaignHints && (
            <Alert severity={"info"} sx={{ mb: 2 }}>
              If you add this world to your campaign, this information will be
              shared with your players.
            </Alert>
          )}
          <RichTextEditorNoTitle
            content={world.description ?? ""}
            onSave={
              canEdit
                ? ({ content, isBeaconRequest }) =>
                    updateWorldDescription(content, isBeaconRequest)
                : undefined
            }
          />
        </>
      )}
      <SectionHeading
        breakContainer
        label={"World Truths"}
        sx={{ mt: canEdit ? 4 : 2 }}
      />
      {canEdit && !hideCampaignHints && (
        <Alert severity={"info"} sx={{ mt: 2 }}>
          If you add this world to a campaign, the world truths will be shared
          with your players, but the quest starters will not.
        </Alert>
      )}
      <Grid container spacing={2} mt={0}>
        {truthIds.map((truthId) => (
          <Grid item xs={12} md={6} lg={4} key={truthId}>
            <TruthCard
              truthId={truthId as TRUTH_IDS}
              storedTruth={world.truths[truthId as TRUTH_IDS]}
              canEdit={canEdit}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
