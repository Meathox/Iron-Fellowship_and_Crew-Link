import { Datasworn } from "@datasworn/core";
import { RulesSliceData } from "../rules.slice.type";

export function parseMovesIntoMaps(
  moveCategories: Record<string, Datasworn.MoveCategory>
): RulesSliceData["moveMaps"] {
  const moveCategoryMap: Record<string, Datasworn.MoveCategory> = {};
  const nonReplacedMoveCategoryMap: Record<string, Datasworn.MoveCategory> = {};
  const moveMap: Record<string, Datasworn.Move> = {};
  const nonReplacedMoveMap: Record<string, Datasworn.Move> = {};

  Object.values(moveCategories).forEach((category) => {
    if (category.contents) {
      if (category.replaces) {
        moveCategoryMap[category.replaces] = category;
      } else {
        moveCategoryMap[category._id] = category;
      }
      nonReplacedMoveCategoryMap[category._id] = category;
      Object.values(category.contents).forEach((move) => {
        if (move.replaces) {
          moveMap[move.replaces] = move;
        }
        moveMap[move._id] = move;
        nonReplacedMoveMap[move._id] = move;
      });
    }
  });

  return {
    moveCategoryMap,
    nonReplacedMoveCategoryMap,
    moveMap,
    nonReplacedMoveMap,
  };
}
