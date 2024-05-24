import { Box, Card, IconButton, Tooltip, Typography } from "@mui/material";
import { HomebrewMoveDocument } from "api-calls/homebrew/moves/moves/_homebrewMove.type";
import { HomebrewMoveCategoryDocument } from "api-calls/homebrew/moves/categories/_homebrewMoveCategory.type";
import PreviewIcon from "@mui/icons-material/Visibility";
import MoveIcon from "@mui/icons-material/DriveFileMove";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { MoveMoveDialog } from "./MoveMoveDialog";
import { useStore } from "stores/store";

export interface MoveCardProps {
  moveId: string;
  move: HomebrewMoveDocument;
  moveCategories: Record<string, HomebrewMoveCategoryDocument>;
  handleEdit: () => void;
  handleDelete: () => void;
  isEditor: boolean;
  dataswornId: string;
}

export function MoveCard(props: MoveCardProps) {
  const {
    moveId,
    move,
    moveCategories,
    handleEdit,
    handleDelete,
    isEditor,
    dataswornId,
  } = props;

  const [moveMoveDialogOpen, setMoveMoveDialogOpen] = useState(false);

  const openDialog = useStore((store) => store.appState.openDialog);

  const moveMap = useStore((store) => store.rules.moveMaps.nonReplacedMoveMap);

  return (
    <>
      <Card
        variant={"outlined"}
        key={moveId}
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant={"h6"}>{move.label}</Typography>
          {move.replacesId && (
            <Typography color={"textSecondary"}>
              Replaces &quot;{moveMap[move.replacesId].name}&quot;
            </Typography>
          )}
        </Box>
        <Box>
          {isEditor ? (
            <>
              <Tooltip title={"Move Move"}>
                <IconButton onClick={() => setMoveMoveDialogOpen(true)}>
                  <MoveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Edit Move"}>
                <IconButton onClick={() => handleEdit()}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={"Delete Move"}>
                <IconButton onClick={() => handleDelete()}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title={"Preview Move"}>
              <IconButton onClick={() => openDialog(dataswornId)}>
                <PreviewIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Card>
      <MoveMoveDialog
        open={moveMoveDialogOpen}
        onClose={() => setMoveMoveDialogOpen(false)}
        moveId={moveId}
        moveCategoryId={move.categoryId}
        categories={moveCategories}
      />
    </>
  );
}
