import { Button, LinearProgress, Typography } from "@mui/material";
import { useDeleteCampaign } from "api/campaign/deleteCampaign";
import { useUpdateCampaignGM } from "api/campaign/updateCampaignGM";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRemoveCharacterFromCampaign } from "../../api/campaign/removeCharacterFromCampaign";
import { useUpdateCampaignSupply } from "../../api/campaign/updateCampaignSupply";
import { useListenToCampaignCharacters } from "../../api/characters/listenToCampaignCharacters";
import { CharacterList } from "../../components/CharacterList/CharacterList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { PageBanner } from "../../components/Layout/PageBanner";
import { SectionHeading } from "../../components/SectionHeading";
import { supplyTrack } from "../../data/defaultTracks";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  constructCampaignJoinUrl,
  constructCharacterSheetUrl,
  paths,
  ROUTES,
} from "../../routes";
import { useCampaignStore } from "../../stores/campaigns.store";
import { Track } from "../character-sheet/components/Track";
import { AddCharacterDialog } from "./components/AddCharacterDialog";
import { CampaignProgressTracks } from "./components/CampaignProgressTracks";
import GMInfo from "./components/GMInfo";

export function CampaignSheetPage() {
  const { campaignId } = useParams();
  const uid = useAuth().user?.uid;

  const { error, success } = useSnackbar();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const campaigns = useCampaignStore((store) => store.campaigns);
  const loading = useCampaignStore((store) => store.loading);

  const { removeCharacterFromCampaign } = useRemoveCharacterFromCampaign();

  const [addCharacterDialogOpen, setAddCharacterDialogOpen] =
    useState<boolean>(false);

  const { updateCampaignSupply } = useUpdateCampaignSupply();

  const campaignCharacters = useListenToCampaignCharacters(campaignId);

  const { updateCampaignGM } = useUpdateCampaignGM();

  const { deleteCampaign } = useDeleteCampaign();

  useEffect(() => {
    if (!loading && (!campaignId || !campaigns[campaignId])) {
      error("You aren't a member of this campaign");
      navigate(paths[ROUTES.CAMPAIGN_SELECT]);
    }
  }, [loading, campaigns, campaignId]);

  if (loading) {
    return (
      <LinearProgress
        sx={{ width: "100vw", position: "absolute", left: 0, marginTop: -3 }}
      />
    );
  }

  if (!campaignId || !campaigns[campaignId]) {
    return null;
  }

  const campaign = campaigns[campaignId];

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.origin + constructCampaignJoinUrl(campaignId))
      .then(() => {
        success("Copied Link to Clipboard");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleRemoveCampaign = async () => {
    try {
      await confirm({
        title: "End Campaign",
        description:
          "Are you sure you want to end your campaign? This will also remove your current characters from the campaign",
        confirmationText: "End",
        confirmationButtonProps: {
          variant: "contained",
          color: "error",
        },
      });

      // will cause the alert bar to pop up
      deleteCampaign({ campaignId, characters: campaign.characters });

      // removeCampaign(campaignId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageBanner>{campaign.name}</PageBanner>
      <SectionHeading
        label={"Campaign GM"}
        breakContainer
        action={
          uid === campaign.gmId && (
            <div>
              <Button onClick={() => updateCampaignGM({ campaignId })}>
                Step Down As GM
              </Button>
              <Button
                variant={"contained"}
                color="error"
                sx={{ ml: 1 }}
                onClick={handleRemoveCampaign}
              >
                End Campaign
              </Button>
            </div>
          )
        }
      />

      {campaign.gmId ? (
        <GMInfo gmId={campaign.gmId} />
      ) : (
        <div>
          <Typography mt={1}>
            This campaign currently does not have a GM.
          </Typography>
          <Button
            variant={"contained"}
            sx={{ mt: 2 }}
            onClick={() => updateCampaignGM({ campaignId, gmId: uid })}
          >
            Mark Self As GM
          </Button>
        </div>
      )}

      <SectionHeading
        label={"Characters"}
        action={
          <div>
            <Button onClick={() => copyLinkToClipboard()}>
              Copy Invite Link
            </Button>
            <Button
              variant={"contained"}
              sx={{ ml: 1 }}
              onClick={() => setAddCharacterDialogOpen(true)}
            >
              Add a Character
            </Button>
          </div>
        }
        breakContainer
        sx={{ mt: 2, mb: 3 }}
      />
      {campaign.characters.length === 0 && (
        <EmptyState
          imageSrc="/assets/nature.svg"
          title={"No Characters"}
          message={"Add a character to the campaign to get started"}
          callToAction={
            <Button
              variant={"contained"}
              onClick={() => setAddCharacterDialogOpen(true)}
            >
              Add a Character
            </Button>
          }
        />
      )}
      <CharacterList
        characters={campaignCharacters}
        actions={(characterId, index) =>
          campaign.characters[index]?.uid === uid ? (
            <>
              <Button
                component={Link}
                to={constructCharacterSheetUrl(characterId)}
              >
                View
              </Button>
              <Button
                color={"error"}
                onClick={() =>
                  removeCharacterFromCampaign({ campaignId, characterId })
                }
              >
                Remove from Campaign
              </Button>
            </>
          ) : (
            <></>
          )
        }
      />
      <SectionHeading label={"Supply Track"} sx={{ mt: 4 }} breakContainer />
      <Track
        sx={{ mt: 4, mb: 4, maxWidth: 400 }}
        min={supplyTrack.min}
        max={supplyTrack.max}
        value={campaign.supply}
        onChange={(newValue) =>
          updateCampaignSupply({ campaignId, supply: newValue })
        }
      />
      <CampaignProgressTracks campaignId={campaignId} />
      <AddCharacterDialog
        open={addCharacterDialogOpen}
        handleClose={() => setAddCharacterDialogOpen(false)}
        campaignId={campaignId}
      />
    </>
  );
}
