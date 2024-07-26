import { Box, IconButton } from "@mui/material";
import SubtractIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { StatComponent } from "components/features/characters/StatComponent";
import { useEffect, useRef } from "react";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useStore } from "stores/store";

export interface MobileStatTrackProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => Promise<void>;
  disableRoll: boolean;
  smallSize?: boolean;
}

export function MobileStatTrack(props: MobileStatTrackProps) {
  const { label, value, min, max, onChange, disableRoll, smallSize } = props;

  const hasUnsavedChangesRef = useRef(false);
  const announce = useStore((store) => store.appState.announce);
  const [localValue, setLocalValue] = useDebouncedState(
    (newValue) => {
      if (newValue !== value) {
        hasUnsavedChangesRef.current = false;
        onChange(newValue).catch(() => setLocalValue(value));
      }
    },
    value,
    500
  );

  const handleChange = (newValue: number | undefined) => {
    if (typeof newValue === "number" && newValue >= min && newValue <= max) {
      hasUnsavedChangesRef.current = true;
      setLocalValue(newValue);
    }
  };

  useEffect(() => {
    if (value !== localValue && !hasUnsavedChangesRef.current) {
      setLocalValue(value);
      announce(`${label} was updated to ${value}`);
    }
  }, [localValue, value, announce, setLocalValue, label]);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius + "px",
        gap: smallSize ? 0 : 0.5,
        py: 0.5,
        px: smallSize ? 0 : 1,
      })}
    >
      <IconButton
        disabled={localValue <= min}
        onClick={() => handleChange(localValue - 1)}
        aria-label={`Subtract 1 ${label}`}
        size={smallSize ? "small" : undefined}
      >
        <SubtractIcon />
      </IconButton>
      <StatComponent
        disableRoll={disableRoll}
        label={label}
        value={localValue}
      />
      <IconButton
        disabled={localValue >= max}
        onClick={() => handleChange(localValue + 1)}
        aria-label={`Add 1 ${label}`}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
