import { Box, Collapse } from "@mui/material";
import { useState } from "react";
import { CollapsibleSectionHeader } from "../CollapsibleSectionHeader";
import { CATEGORY_VISIBILITY } from "./useFilterMoves";
import { Datasworn } from "@datasworn/core";
import { Move } from "./Move";

export interface MoveCategoryProps {
  category: Datasworn.MoveCategory;
  moveMap: Record<string, Datasworn.Move>;
  openMove: (move: Datasworn.Move) => void;
  forceOpen?: boolean;
  visibleCategories: Record<string, CATEGORY_VISIBILITY>;
  visibleMoves: Record<string, boolean>;
  shouldExpandLocally?: boolean;
}

export function MoveCategory(props: MoveCategoryProps) {
  const {
    category,
    moveMap,
    openMove,
    forceOpen,
    visibleCategories,
    visibleMoves,
    shouldExpandLocally,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const isExpandedOrForced = isExpanded || forceOpen;

  if (visibleCategories[category._id] === CATEGORY_VISIBILITY.HIDDEN) {
    return null;
  }

  return (
    <>
      <CollapsibleSectionHeader
        open={isExpanded}
        forcedOpen={forceOpen}
        toggleOpen={() => !forceOpen && setIsExpanded((prev) => !prev)}
        text={category.name}
      />

      <Collapse in={isExpandedOrForced}>
        <Box
          sx={{
            mb: isExpandedOrForced ? 0.5 : 0,
          }}
        >
          {Object.values(category.contents ?? {}).map((move, index) =>
            visibleCategories[category._id] === CATEGORY_VISIBILITY.ALL ||
            visibleMoves[move._id] === true ? (
              <Move
                key={index}
                move={moveMap[move._id]}
                disabled={!isExpandedOrForced}
                openMove={openMove}
                shouldExpandLocally={shouldExpandLocally}
              />
            ) : null
          )}
        </Box>
      </Collapse>
    </>
  );
}
