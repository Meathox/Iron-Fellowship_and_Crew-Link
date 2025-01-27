import { Autocomplete, Box, ListItemText, TextField } from "@mui/material";
import { useStore } from "stores/store";

export interface MoveAutocompleteProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  onBlur: () => void;
  helperText?: string;
  showOriginalMoveName?: boolean;
}

export function MoveAutocomplete(props: MoveAutocompleteProps) {
  const {
    label,
    value,
    onChange,
    disabled,
    onBlur,
    helperText,
    showOriginalMoveName,
  } = props;

  const moveMap = useStore((store) =>
    showOriginalMoveName
      ? store.rules.moveMaps.nonReplacedMoveMap
      : store.rules.moveMaps.moveMap
  );

  return (
    <Autocomplete
      options={Object.keys(moveMap)}
      getOptionKey={(option) => option}
      getOptionLabel={(key) => moveMap[key]?.name}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={helperText}
          label={label ?? "Move Categories"}
        />
      )}
      renderOption={(props, option) => (
        <Box component={"li"} {...props}>
          <ListItemText
            primary={moveMap[option].name}
            secondary={moveMap[option]._id}
          />
        </Box>
      )}
      value={value ?? null}
      onChange={(evt, value) => {
        onChange(value ?? undefined);
      }}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
}
