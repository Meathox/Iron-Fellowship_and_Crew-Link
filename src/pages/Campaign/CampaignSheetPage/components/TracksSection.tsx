import { SectionHeading } from "components/shared/SectionHeading";
import { Track } from "components/features/Track";
import { supplyTrack } from "data/defaultTracks";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { CampaignProgressTracks } from "./CampaignProgressTracks";
import { useStore } from "stores/store";

export interface TracksSectionProps {
  campaign: CampaignDocument;
  addTopMargin: boolean;
}

export function TracksSection(props: TracksSectionProps) {
  const { campaign, addTopMargin } = props;

  const updateCampaignSupply = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignSupply
  );

  return (
    <>
      <SectionHeading
        label={"Supply Track"}
        sx={{ mt: addTopMargin ? 4 : 0 }}
        breakContainer
      />
      <Track
        sx={{ mt: 4, mb: 4, maxWidth: 400 }}
        min={supplyTrack.min}
        max={supplyTrack.max}
        value={campaign.supply}
        onChange={(newValue) => updateCampaignSupply(newValue).catch(() => {})}
      />
      <CampaignProgressTracks />
    </>
  );
}
