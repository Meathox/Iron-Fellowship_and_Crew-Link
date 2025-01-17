import { Box } from "@mui/material";
import { StatComponent } from "components/features/characters/StatComponent";
import { TryItOut } from "./TryItOut";
import { useCallback, useState } from "react";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useRoller } from "stores/appState/useRoller";
import { TextFieldWithOracle } from "components/shared/TextFieldWithOracle/TextFieldWithOracle";

const nameOraclesIronsworn = [
  "classic/oracles/name/ironlander/a",
  "classic/oracles/name/ironlander/b",
];

const nameOracleStarforged = [
  "starforged/oracles/characters/name/given",
  "starforged/oracles/characters/name/family_name",
];

export function ExampleStatsSection() {
  const nameOracles = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: nameOraclesIronsworn,
    [GAME_SYSTEMS.STARFORGED]: nameOracleStarforged,
  });
  const joinOracles = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: false,
    [GAME_SYSTEMS.STARFORGED]: true,
  });

  const { rollOracleTable } = useRoller();
  const handleOracleRoll = useCallback(() => {
    if (joinOracles) {
      return nameOracles
        .map((id) => rollOracleTable(id, false)?.result ?? "")
        .join(" ");
    } else {
      const oracleIndex = Math.floor(Math.random() * nameOracles.length);

      return rollOracleTable(nameOracles[oracleIndex], false)?.result;
    }
  }, [rollOracleTable, nameOracles, joinOracles]);

  const [name, setName] = useState(() => handleOracleRoll() ?? "");

  return (
    <TryItOut>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <TextFieldWithOracle
          getOracleValue={() => handleOracleRoll() ?? ""}
          label={"Name"}
          name={"name"}
          value={name}
          onChange={(value) => setName(value)}
          sx={{ maxWidth: 350, my: 0.5 }}
          fullWidth
          variant={"outlined"}
          color={"primary"}
          autoComplete={"off"}
        />
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          my={0.5}
        >
          <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"}>
            <StatComponent label={"Edge"} value={2} sx={{ mx: 0.5, my: 0.5 }} />
            <StatComponent
              label={"Heart"}
              value={3}
              sx={{ mx: 0.5, my: 0.5 }}
            />
            <StatComponent label={"Iron"} value={1} sx={{ mx: 0.5, my: 0.5 }} />
            <StatComponent
              label={"Shadow"}
              value={1}
              sx={{ mx: 0.5, my: 0.5 }}
            />
            <StatComponent label={"Wits"} value={2} sx={{ mx: 0.5, my: 0.5 }} />
          </Box>
        </Box>
      </Box>
    </TryItOut>
  );
}
