import { Box, DialogContent, Stack, Typography } from "@mui/material";
import { LinkedDialogContentTitle } from "../LinkedDialogContentTitle";
import { useStore } from "stores/store";
import { MarkdownRenderer } from "components/shared/MarkdownRenderer";
import { OracleButton } from "components/features/charactersAndCampaigns/OracleSection/OracleButton";
import { MoveRollers } from "./MoveRollers";

export interface MoveDialogContentProps {
  id: string;
  handleBack: () => void;
  handleClose: () => void;
  isLastItem: boolean;
}

export function MoveDialogContent(props: MoveDialogContentProps) {
  const { id, handleBack, handleClose, isLastItem } = props;

  const moves = useStore((store) => store.rules.moveMaps.moveMap);
  const move = moves[id];
  if (!move) {
    return (
      <>
        <LinkedDialogContentTitle
          id={id}
          handleBack={handleBack}
          handleClose={handleClose}
          isLastItem={isLastItem}
        >
          Move Not Found
        </LinkedDialogContentTitle>
        <DialogContent>Sorry, we could not find that move.</DialogContent>
      </>
    );
  }

  return (
    <>
      <LinkedDialogContentTitle
        id={id}
        handleBack={handleBack}
        handleClose={handleClose}
        isLastItem={isLastItem}
      >
        {move.name}
      </LinkedDialogContentTitle>
      <DialogContent>
        <MoveRollers move={move} />
        <MarkdownRenderer markdown={move.text} />
        {move.oracles && (
          <Box mt={2}>
            <Typography variant={"overline"}>
              Roll Oracle{move.oracles.length > 1 ? "s" : ""}
            </Typography>
            <Stack direction={"row"} flexWrap={"wrap"} spacing={1}>
              {move.oracles.map((oracleId) => (
                <OracleButton
                  color={"inherit"}
                  variant={"outlined"}
                  key={oracleId}
                  oracleId={oracleId}
                />
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>
    </>
  );
}
