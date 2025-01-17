import {
  Box,
  ButtonBase,
  Checkbox,
  FormControlLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ProgressTrackTick } from "components/features/ProgressTrack/ProgressTrackTick";
import UncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckedIcon from "@mui/icons-material/CheckBox";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import { useId } from "react";
import { useStore } from "stores/store";

export interface LegacyTrackProps {
  label: string;
  value: number;
  checkedExperience: { [key: number]: boolean };
  onValueChange?: (value: number) => void;
  onExperienceChecked?: (index: number, checked: boolean) => void;
  isLegacy: boolean;
  onIsLegacyChecked?: (checked: boolean) => void;
}

export function LegacyTrack(props: LegacyTrackProps) {
  const {
    label,
    value,
    checkedExperience,
    onValueChange,
    onExperienceChecked,
    isLegacy,
    onIsLegacyChecked,
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const checks = [];
  let checksIndex = 0;
  let checksValue = 0;

  for (let i = 0; i <= 40; i++) {
    if (i % 4 === 0 && i !== 0) {
      checks[checksIndex] = checksValue;
      checksIndex++;
      checksValue = 0;
    }

    if (i < value) {
      checksValue++;
    }
  }

  const labelId = useId();
  const getValueText = (value: number) => {
    return `${value} ticks: (${Math.floor(value / 4)} boxes fully filled)`;
  };

  const announce = useStore((store) => store.appState.announce);

  return (
    <Box display={"flex"}>
      <Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            variant={"h6"}
            color={(theme) => theme.palette.text.primary}
            fontFamily={(theme) => theme.fontFamilyTitle}
            sx={{ mr: 4 }}
            id={labelId}
          >
            {label}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isLegacy}
                disabled={!onIsLegacyChecked}
                onChange={(evt, value) =>
                  onIsLegacyChecked && onIsLegacyChecked(value)
                }
              />
            }
            label={"10"}
          />
        </Box>
        <Box
          display={"flex"}
          color={(theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]
          }
        >
          {onValueChange && (
            <ButtonBase
              onClick={() => {
                if (onValueChange) {
                  const newValue = Math.max(value - 1, 0);
                  onValueChange(newValue);
                  if (newValue === value) {
                    announce(`${label} is already at zero ticks`);
                  } else {
                    announce(`Updated ${label} to ${getValueText(newValue)}`);
                  }
                }
              }}
              sx={(theme) => ({
                height: isMobile ? 34 : 48,
                backgroundColor:
                  theme.palette.darkGrey[
                    theme.palette.mode === "light" ? "main" : "light"
                  ],
                color: theme.palette.darkGrey.contrastText,
                px: 0.5,
                "&:hover": {
                  backgroundColor: theme.palette.darkGrey.dark,
                },
                borderTopLeftRadius: `${theme.shape.borderRadius}px`,
                borderBottomLeftRadius: `${theme.shape.borderRadius}px`,
              })}
            >
              <MinusIcon />
            </ButtonBase>
          )}
          <Box>
            <Box
              display={"flex"}
              bgcolor={(theme) => theme.palette.background.paper}
              color={(theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[600]
                  : theme.palette.grey[300]
              }
              borderTop={1}
              borderBottom={1}
              borderLeft={onValueChange ? 0 : 1}
              borderRight={onValueChange ? 0 : 1}
              borderColor={(theme) => theme.palette.divider}
              role={"meter"}
              aria-labelledby={labelId}
              aria-valuemin={0}
              aria-valuemax={40}
              aria-valuenow={value}
              aria-valuetext={getValueText(value)}
            >
              {checks.map((value, index) => (
                <Box
                  key={index}
                  sx={(theme) => ({
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "transparent",
                    borderLeftColor:
                      index !== 0 ? theme.palette.divider : undefined,
                    width: isMobile ? 34 : 48,
                    height: isMobile ? 34 : 48,
                  })}
                >
                  <ProgressTrackTick
                    value={value}
                    key={index}
                    aria-hidden
                    size={{ mobile: 32, desktop: 40 }}
                  />
                </Box>
              ))}
            </Box>
            <Box display={"flex"}>
              {checks.map((value, index) => (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  fontSize={isMobile ? 16 : 24}
                  key={index}
                  width={isMobile ? 34 : 48}
                >
                  <Checkbox
                    sx={{ p: 0 }}
                    icon={<UncheckedIcon fontSize={"inherit"} />}
                    checkedIcon={<CheckedIcon fontSize={"inherit"} />}
                    disabled={value !== 4 || !onExperienceChecked}
                    checked={checkedExperience[index * 2] ?? false}
                    onChange={(evt, checked) =>
                      onExperienceChecked &&
                      onExperienceChecked(index * 2, checked)
                    }
                  />
                  {!isLegacy && (
                    <Checkbox
                      sx={{ p: 0 }}
                      icon={<UncheckedIcon fontSize={"inherit"} />}
                      checkedIcon={<CheckedIcon fontSize={"inherit"} />}
                      disabled={value !== 4 || !onExperienceChecked}
                      checked={checkedExperience[index * 2 + 1] ?? false}
                      onChange={(evt, checked) =>
                        onExperienceChecked &&
                        onExperienceChecked(index * 2 + 1, checked)
                      }
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
          {onValueChange && (
            <ButtonBase
              onClick={() => {
                if (onValueChange) {
                  const newValue = Math.min(value + 1, 40);
                  onValueChange(newValue);
                  if (newValue === value) {
                    announce(
                      `${label} is already at its maximum value of 40 ticks`
                    );
                  } else {
                    announce(`Updated ${label} to ${getValueText(newValue)}`);
                  }
                }
              }}
              sx={(theme) => ({
                height: isMobile ? 34 : 48,
                backgroundColor:
                  theme.palette.darkGrey[
                    theme.palette.mode === "light" ? "main" : "light"
                  ],
                color: theme.palette.darkGrey.contrastText,
                px: 0.5,
                "&:hover": {
                  backgroundColor: theme.palette.darkGrey.dark,
                },
                borderTopRightRadius: `${theme.shape.borderRadius}px`,
                borderBottomRightRadius: `${theme.shape.borderRadius}px`,
              })}
            >
              <PlusIcon />
            </ButtonBase>
          )}
        </Box>
      </Box>
    </Box>
  );
}
