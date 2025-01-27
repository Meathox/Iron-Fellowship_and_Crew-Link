import { Box, ButtonBase, Grid } from "@mui/material";
import { momentumTrack } from "data/defaultTracks";
import { Track } from "components/features/Track";
import ResetIcon from "@mui/icons-material/Replay";
import { useStore } from "stores/store";
import { useIsMobile } from "hooks/useIsMobile";
import { MobileStatTrack } from "./MobileStatTrack";
import { MomentumTrackMobile } from "./MomentumTrackMobile";
import { NonLinearMeters } from "./NonLinearMeters";

export type TRACK_KEYS = "health" | "spirit" | "supply" | "momentum";

export function TracksSection() {
  const conditionMeters = useStore((store) => store.rules.conditionMeters);

  const numberOfActiveDebilities = useStore((store) => {
    return Object.values(
      store.characters.currentCharacter.currentCharacter?.debilities ?? {}
    ).filter((debility) => debility).length;
  });
  const isInCampaign = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const updateCampaignConditionMeter = useStore(
    (store) => store.campaigns.currentCampaign.updateCampaignConditionMeter
  );
  const updateCharacter = useStore(
    (store) => store.characters.currentCharacter.updateCurrentCharacter
  );
  const updateCharacterConditionMeter = useStore(
    (store) => store.characters.currentCharacter.updateCharacterConditionMeter
  );

  const momentum = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.momentum ?? 0
  );

  const maxMomentum = momentumTrack.max - numberOfActiveDebilities;

  let momentumResetValue = momentumTrack.startingValue;

  if (numberOfActiveDebilities >= 2) {
    momentumResetValue = 0;
  } else if (numberOfActiveDebilities === 1) {
    momentumResetValue = 1;
  }
  const characterConditionMeters = useStore(
    (store) =>
      store.characters.currentCharacter.currentCharacter?.conditionMeters
  );
  const campaignConditionMeters = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.conditionMeters
  );

  const getConditionMeterValue = (conditionMeterKey: string): number => {
    const conditionMeter = conditionMeters[conditionMeterKey];

    if (conditionMeter.shared && isInCampaign && campaignConditionMeters) {
      return campaignConditionMeters[conditionMeterKey] ?? conditionMeter.value;
    } else if (
      (!conditionMeter.shared || !isInCampaign) &&
      characterConditionMeters
    ) {
      return (
        characterConditionMeters[conditionMeterKey] ?? conditionMeter.value
      );
    }

    return conditionMeter.value;
  };

  const updateMomentum = (newValue: number) => {
    return updateCharacter({
      momentum: newValue,
    });
  };
  const updateConditionMeter = (
    conditionMeterKey: string,
    newValue: number
  ) => {
    const conditionMeter = conditionMeters[conditionMeterKey];

    if (conditionMeter.shared && isInCampaign) {
      return updateCampaignConditionMeter(conditionMeterKey, newValue);
    } else {
      return updateCharacterConditionMeter(conditionMeterKey, newValue);
    }
  };

  const isMobile = useIsMobile();

  return (
    <Grid
      container
      spacing={isMobile ? 1 : 2}
      sx={isMobile ? { mt: 0 } : undefined}
    >
      {Object.keys(conditionMeters).map((conditionMeterKey) =>
        isMobile ? (
          <Grid item xs={6} key={conditionMeterKey}>
            <MobileStatTrack
              label={conditionMeters[conditionMeterKey].label}
              value={getConditionMeterValue(conditionMeterKey)}
              onChange={(newValue) =>
                updateConditionMeter(conditionMeterKey, newValue)
              }
              disableRoll={!conditionMeters[conditionMeterKey].rollable}
              min={conditionMeters[conditionMeterKey].min}
              max={conditionMeters[conditionMeterKey].max}
            />
          </Grid>
        ) : (
          <Grid item xs={12} md={4} key={conditionMeterKey}>
            <Track
              label={conditionMeters[conditionMeterKey].label}
              value={getConditionMeterValue(conditionMeterKey)}
              onChange={(newValue) =>
                updateConditionMeter(conditionMeterKey, newValue)
              }
              min={conditionMeters[conditionMeterKey].min}
              max={conditionMeters[conditionMeterKey].max}
            />
          </Grid>
        )
      )}
      {isMobile ? (
        <Grid item xs={6}>
          <MomentumTrackMobile
            value={momentum}
            onChange={(newValue) => updateMomentum(newValue)}
            min={momentumTrack.min}
            max={maxMomentum ?? momentumTrack.max}
            resetValue={momentumResetValue ?? momentumTrack.startingValue}
          />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Box display={"flex"}>
            <Track
              label={"Momentum"}
              value={momentum}
              onChange={(newValue) => updateMomentum(newValue)}
              min={momentumTrack.min}
              max={maxMomentum ?? momentumTrack.max}
              sx={{ flexGrow: 1 }}
            />
            <ButtonBase
              sx={(theme) => ({
                backgroundColor: theme.palette.darkGrey.main,
                color: theme.palette.darkGrey.contrastText,
                borderRadius: `${theme.shape.borderRadius}px`,
                ml: 0.25,

                "&:hover": {
                  backgroundColor: theme.palette.darkGrey.dark,
                },
              })}
              onClick={() =>
                updateMomentum(
                  momentumResetValue ?? momentumTrack.startingValue
                )
              }
            >
              <ResetIcon />
            </ButtonBase>
          </Box>
        </Grid>
      )}
      <NonLinearMeters />
    </Grid>
  );
}
