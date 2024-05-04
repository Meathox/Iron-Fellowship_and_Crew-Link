import { Box, Card, CardActionArea, Typography } from "@mui/material";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "stores/store";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import OpenIcon from "@mui/icons-material/ChevronRight";

export interface CampaignCard {
  campaign: CampaignDocument;
  campaignId: string;
}

export function CampaignCard(props: CampaignCard) {
  const { campaign, campaignId } = props;

  const gmIds = campaign.gmIds;

  const loadUserDocuments = useStore((store) => store.users.loadUserDocuments);
  useEffect(() => {
    loadUserDocuments(gmIds ?? []);
  }, [gmIds, loadUserDocuments]);

  const gmNameString = useStore((store) => {
    const gmNames: string[] = [];
    gmIds?.forEach((gmId) => {
      const displayName = store.users.userMap[gmId]?.doc?.displayName;
      if (displayName) {
        gmNames.push(displayName);
      }
    });
    return gmNames.join(", ");
  });

  return (
    <Card elevation={2} sx={{ height: "100%" }}>
      <CardActionArea
        component={Link}
        to={constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET)}
        sx={{ p: 2, height: "100%", display: "flex", alignItems: "flex-start" }}
      >
        <Box flexGrow={1}>
          <Typography variant={"h6"} component={"p"}>
            {campaign.name}
          </Typography>
          <Typography color={"textSecondary"} component={"p"}>
            {(!campaign.gmIds || campaign.gmIds.length === 0) && "No GM Found"}
            {gmNameString}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          alignSelf={"stretch"}
        >
          <OpenIcon aria-hidden />
        </Box>
      </CardActionArea>
    </Card>
  );
}
