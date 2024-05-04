import { Box, Card, CardActionArea, Typography } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import HiddenIcon from "@mui/icons-material/VisibilityOff";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { NPCDocumentWithGMProperties } from "stores/world/currentWorld/npcs/npcs.slice.type";
import { Sector } from "types/Sector.type";
import { useGameSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export interface NPCItemProps {
  npc: NPCDocumentWithGMProperties;
  locations: { [key: string]: LocationWithGMProperties };
  sectors: { [key: string]: Sector };
  openNPC: () => void;
  showHiddenTag?: boolean;
}

export function NPCItem(props: NPCItemProps) {
  const { npc, locations, sectors, openNPC, showHiddenTag } = props;

  const showSectors = useGameSystem().gameSystem === GAME_SYSTEMS.STARFORGED;

  const npcLocation = showSectors
    ? npc.lastSectorId
      ? sectors[npc.lastSectorId]
      : undefined
    : npc.lastLocationId
    ? locations[npc.lastLocationId]
    : undefined;

  return (
    <Card variant={"outlined"} sx={{ overflow: "visible" }}>
      <CardActionArea
        onClick={() => openNPC()}
        sx={(theme) => ({
          p: 2,
          "& #portrait": {
            marginTop: -3,
            marginLeft: -1,
            transitionProperty: "margin-top margin-bottom",
            transitionDuration: `${theme.transitions.duration.shorter}ms`,
            transitionTimingFunction: theme.transitions.easing.easeInOut,
          },
          "&:hover, &:focus-visible": {
            "& #portrait": {
              marginTop: -1.5,
              marginBottom: -1.5,
            },
          },
        })}
      >
        <Box display={"flex"} alignItems={"start"}>
          <Box
            id={"portrait"}
            sx={(theme) => ({
              marginRight: 1,
              width: 80,
              height: 80,
              flexShrink: 0,
              borderRadius: `${theme.shape.borderRadius}px`,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[300]
                  : theme.palette.grey[700],
              backgroundImage: `url(${npc.imageUrl})`,
              backgroundPosition: "center top",
              backgroundSize: "cover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: theme.shadows[3],
            })}
          >
            {!npc.imageUrl && (
              <PhotoIcon
                sx={(theme) => ({
                  color:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[500]
                      : theme.palette.grey[300],
                })}
              />
            )}
          </Box>
          <Box
            display={"flex"}
            alignItems={"flex-start"}
            justifyContent={"space-between"}
            flexGrow={1}
            overflow={"hidden"}
          >
            <Box overflow={"hidden"}>
              <Typography
                whiteSpace={"nowrap"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
              >
                {npc.name}
              </Typography>

              {npcLocation && (
                <Typography
                  variant={"caption"}
                  color={"textSecondary"}
                  whiteSpace={"nowrap"}
                  overflow={"hidden"}
                  textOverflow={"ellipsis"}
                  component={"p"}
                >
                  {npcLocation.name}
                </Typography>
              )}
            </Box>
            {!npc.sharedWithPlayers && showHiddenTag && (
              <HiddenIcon color={"action"} />
            )}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
