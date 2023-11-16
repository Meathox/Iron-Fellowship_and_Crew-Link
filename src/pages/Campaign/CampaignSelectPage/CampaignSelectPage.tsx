import {
  Box,
  Button,
  Grid,
  Hidden,
  Fab,
  LinearProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useState } from "react";
import { EmptyState } from "components/shared/EmptyState/EmptyState";
import { CreateCampaignDialog } from "./components/CreateCampaignDialog";
import CreateCampaignIcon from "@mui/icons-material/GroupAdd";
import { PageContent, PageHeader } from "components/shared/Layout";
import { CampaignCard } from "./components/CampaignCard";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { useAppName } from "hooks/useAppName";
import { FooterFab } from "components/shared/Layout/FooterFab";

export function CampaignSelectPage() {
  const sortedCampaignIds = useStore((store) =>
    Object.keys(store.campaigns.campaignMap).sort((key1, key2) => {
      const name1 = store.campaigns.campaignMap[key1].name;
      const name2 = store.campaigns.campaignMap[key2].name;

      if (name1 < name2) {
        return -1;
      } else if (name1 > name2) {
        return 1;
      }
      return 0;
    })
  );
  const campaignMap = useStore((store) => store.campaigns.campaignMap);
  const loading = useStore((store) => store.campaigns.loading);
  const error = useStore((store) => store.campaigns.error);

  const [createCampaignDialogOpen, setCreateCampaignDialogOpen] =
    useState<boolean>(false);

  const appName = useAppName();

  if (loading) {
    return <LinearProgress color={"primary"} />;
  }

  return (
    <>
      <Head
        title={"Your Campaigns"}
        description={`A list of all the campaigns you have joined in ${appName}`}
      />
      <PageHeader
        label={"Your Campaigns"}
        actions={
          <Hidden smDown>
            <Button
              onClick={() => setCreateCampaignDialogOpen(true)}
              color={"primary"}
              variant={"contained"}
              endIcon={<CreateCampaignIcon />}
            >
              Create a Campaign
            </Button>
          </Hidden>
        }
      />
      <PageContent isPaper={sortedCampaignIds.length === 0}>
        {error && (
          <Alert severity="error">
            <AlertTitle>Error Loading Campaigns</AlertTitle>
            {error}
          </Alert>
        )}
        {sortedCampaignIds.length === 0 ? (
          <EmptyState
            showImage
            title={"Create your First Campaign"}
            message={
              "Campaigns allow you to share tracks, worlds, and more between GMs and players"
            }
            callToAction={
              <Button
                onClick={() => setCreateCampaignDialogOpen(true)}
                variant={"contained"}
                endIcon={<CreateCampaignIcon />}
              >
                Create a Campaign
              </Button>
            }
          />
        ) : (
          <Grid container spacing={2}>
            {sortedCampaignIds.map((campaignId, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CampaignCard
                  campaignId={campaignId}
                  campaign={campaignMap[campaignId]}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </PageContent>

      <Hidden smUp>
        <Box height={80} />
      </Hidden>
      <Hidden smUp>
        <FooterFab
          onClick={() => setCreateCampaignDialogOpen(true)}
          color={"primary"}
        >
          <CreateCampaignIcon />
        </FooterFab>
      </Hidden>
      <CreateCampaignDialog
        open={createCampaignDialogOpen}
        handleClose={() => setCreateCampaignDialogOpen(false)}
      />
    </>
  );
}
