import {
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
} from "@mui/material";
import { LocationHexagon, LocationHexagonProps } from "./LocationHexagon";
import {
  LocationMap as ILocationMap,
  MapEntryBackgroundColors,
  MapEntryType,
} from "types/Locations.type";
import { useStore } from "stores/store";
import { useState } from "react";
import { MapTool, MapTools } from "./MapTools.enum";
import { MapToolChooser } from "./MapToolChooser";
import { arrayUnion } from "firebase/firestore";
import { LocationItemAvatar } from "./LocationItemAvatar";
import { checkIsLocationCell, getValidLocations } from "./checkIsLocationCell";
import { LocationWithGMProperties } from "stores/world/currentWorld/locations/locations.slice.type";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS } from "types/GameSystems.type";
import { locationConfigs } from "config/locations.config";
import { useRoller } from "stores/appState/useRoller";

export interface LocationMapProps {
  locationId: string;
  map?: ILocationMap;
}

export function LocationMap(props: LocationMapProps) {
  const { locationId, map = {} } = props;

  const rows = 13;
  const cols = 18;
  const s = 20;

  // Calculate SVG dimensions
  const width: number = cols * s * Math.sqrt(3) + (s * Math.sqrt(3)) / 2; // Updated
  const height: number = rows * 1.5 * s + s / 2 + 1; // Updated

  const verticalSpacing: number = 1.5 * s; // Updated
  const horizontalSpacing: number = s * Math.sqrt(3); // Updated
  const offsetX: number = (s * Math.sqrt(3)) / 2; // New offset for vertical positioning

  const settingId = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "ironlands",
    [GAME_SYSTEMS.STARFORGED]: "forge",
  });
  const settingConfig = locationConfigs[settingId];

  const locationMap = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.locationMap
  );
  const createLocation = useStore(
    (store) =>
      store.worlds.currentWorld.currentWorldLocations.createSpecificLocation
  );
  const updateLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.updateLocation
  );
  const setOpenLocationId = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.setOpenLocationId
  );
  const moveLocation = useStore(
    (store) => store.worlds.currentWorld.currentWorldLocations.moveLocation
  );

  const [mapTool, setMapTool] = useState<MapTool>();

  const [multiLocationChooserState, setMultiLocationChooserState] = useState<{
    open: boolean;
    locationIds: string[];
    parentCell?: SVGPolygonElement;
  }>({
    open: false,
    locationIds: [],
  });

  const { rollOracleTable } = useRoller();

  const handleHexClick = (
    row: number,
    col: number,
    locationIds: string[] | undefined,
    cellRef: SVGPolygonElement
  ) => {
    // TODO - check if location still exists when overwriting. If it doesn't, we can overwrite it no problem
    if (mapTool?.type === MapTools.AddPath) {
      const currentCell = map[row]?.[col];
      if (
        !checkIsLocationCell(currentCell ?? undefined, locationId, locationMap)
      ) {
        updateLocation(locationId, {
          [`map.${row}.${col}.type`]:
            currentCell?.type === MapEntryType.Path ? null : MapEntryType.Path,
        }).catch(() => {});
      }
    } else if (mapTool?.type === MapTools.AddLocation) {
      const type = mapTool.locationType;
      const locationConfig = settingConfig?.locationTypeOverrides?.[type];
      const configCreateLocation =
        settingConfig?.locationTypeOverrides?.[type]?.config.createLocation;
      createLocation({
        name: `${locationConfig ? locationConfig.label : "New Location"}`,
        parentLocationId: locationId,
        sharedWithPlayers: true,
        type: type,
        updatedDate: new Date(),
        createdDate: new Date(),
        ...(configCreateLocation ? configCreateLocation(rollOracleTable) : {}),
      })
        .then((id) => {
          updateLocation(locationId, {
            [`map.${row}.${col}.type`]: MapEntryType.Location,
            [`map.${row}.${col}.locationIds`]: arrayUnion(id),
          }).catch(() => {});
        })
        .catch(() => {});
      setMapTool(undefined);
    } else if (mapTool?.type === MapTools.MoveLocation) {
      const locationToMove = locationMap[mapTool.locationId];
      if (locationToMove) {
        moveLocation(
          mapTool.locationId,
          locationToMove,
          locationId,
          row,
          col
        ).catch(() => {});
        setMapTool(undefined);
      }
    } else if (mapTool?.type === MapTools.BackgroundPaint) {
      const color = mapTool.color;
      updateLocation(locationId, {
        [`map.${row}.${col}.background.color`]: color,
      }).catch(() => {});
    } else if (!mapTool && locationIds) {
      const filteredLocationIds = getValidLocations(
        locationId,
        locationMap,
        locationIds
      );
      if (filteredLocationIds.length === 1) {
        setOpenLocationId(filteredLocationIds[0]);
      } else if (filteredLocationIds.length > 1) {
        setMultiLocationChooserState({
          open: true,
          locationIds: filteredLocationIds,
          parentCell: cellRef,
        });
      }
    } else if (mapTool?.type === MapTools.BackgroundEraser) {
      updateLocation(locationId, {
        [`map.${row}.${col}.background`]: null,
      }).catch(() => {});
    }
  };

  const handleFillBackground = () => {
    if (mapTool?.type === MapTools.BackgroundPaint) {
      const color = mapTool.color;
      const updates: Record<string, MapEntryBackgroundColors> = {};
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - (row % 2 === 1 ? 1 : 0); col++) {
          updates[`map.${row}.${col}.background.color`] = color;
        }
      }
      updateLocation(locationId, updates).catch(() => {});
      setMapTool(undefined);
    } else if (mapTool?.type === MapTools.BackgroundEraser) {
      const updates: Record<string, null> = {};
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - (row % 2 === 1 ? 1 : 0); col++) {
          updates[`map.${row}.${col}.background`] = null;
        }
      }
      updateLocation(locationId, updates).catch(() => {});
      setMapTool(undefined);
    }
  };

  return (
    <Box
      width={"100%"}
      overflow={"hidden"}
      sx={{
        bgcolor: "background.mapBackground",
        color: "#fff",
        p: { xs: 2, md: 3 },
        overflowX: "auto",
      }}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: width,
          color: "#fff",
          "&>svg": {
            display: "flex",
            marginX: "auto",
          },

          "& .hexagon": {
            cursor: "pointer",
            fill: theme.palette.grey[900],
            fillOpacity: "0%",
            color: theme.palette.grey[600],
            "&:hover": {
              fill: theme.palette.grey[200],
              fillOpacity: "20%",
            },
          },
          "& .path-line": {
            color: theme.palette.grey[300],
            background: "none",
            pointerEvents: "none",
            height: 0,
            overflow: "visible",
          },
        })}
      >
        {(mapTool?.type === MapTools.BackgroundPaint ||
          mapTool?.type === MapTools.BackgroundEraser) && (
          <Box mb={1} color={"grey.300"} mx={"auto"}>
            <Button
              color={"inherit"}
              size={"small"}
              variant={"outlined"}
              sx={{ ml: 1 }}
              onClick={() => handleFillBackground()}
            >
              {mapTool?.type === MapTools.BackgroundPaint
                ? "Fill Background"
                : "Clear Background"}
            </Button>
          </Box>
        )}
        <svg
          width={width}
          height={height}
          style={{ minWidth: width, minHeight: height }}
        >
          {new Array(rows).fill(0).map((_, row) => {
            return new Array(cols - (row % 2 === 1 ? 1 : 0))
              .fill(0)
              .map((_, col) => {
                const x: number =
                  col * horizontalSpacing + (row % 2 === 1 ? offsetX : 0) + s; // Offset every other row
                const y: number = row * verticalSpacing + s; // Start with one hexagon's height

                const mapEntry = map[row]?.[col];

                let pathConnections: LocationHexagonProps["pathConnections"] =
                  undefined;

                if (mapEntry?.type === MapEntryType.Path) {
                  pathConnections = getConnections(
                    map,
                    row,
                    col,
                    locationId,
                    locationMap
                  );
                }

                const locationIds =
                  mapEntry?.type === MapEntryType.Location
                    ? mapEntry.locationIds
                    : [];

                return (
                  <LocationHexagon
                    locationId={locationId}
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    size={s}
                    locationMap={locationMap}
                    mapEntry={mapEntry ?? undefined}
                    pathConnections={pathConnections}
                    onClick={(cell) =>
                      handleHexClick(row, col, locationIds, cell)
                    }
                  />
                );
              });
          })}
          {new Array(rows).fill(0).map((r, row) => {
            return new Array(cols - (row % 2 === 1 ? 1 : 0))
              .fill(0)
              .map((c, col) => {
                const x: number =
                  col * horizontalSpacing + (row % 2 === 1 ? offsetX : 0) + s; // Offset every other row
                const y: number = row * verticalSpacing + s; // Start with one hexagon's height

                let locationIds: string[] = [];
                const hex = map[row]?.[col];
                if (hex?.type === MapEntryType.Location) {
                  locationIds = getValidLocations(
                    locationId,
                    locationMap,
                    hex.locationIds
                  );
                }

                let name: string | undefined = undefined;

                if (locationIds.length === 1) {
                  name = locationMap[locationIds[0]]?.name;
                } else if (locationIds.length > 1) {
                  name = `${locationIds.length} Locations`;
                }

                if (name) {
                  return (
                    <text
                      key={`${x}-${y}`}
                      x={x}
                      y={y - (s * 3) / 4} // Position the label below the hexagon
                      fontSize={(s * 3) / 4} // Adjust font size based on hexagon size
                      textAnchor="middle" // Center the text
                      fill={"#fff"}
                      style={{
                        background: "none",
                        pointerEvents: "none",
                      }}
                    >
                      {name}
                    </text>
                  );
                } else {
                  return null;
                }
              });
          })}
        </svg>
        <Menu
          open={multiLocationChooserState.open}
          anchorEl={multiLocationChooserState.parentCell}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() =>
            setMultiLocationChooserState((prev) => ({ ...prev, open: false }))
          }
        >
          {multiLocationChooserState.locationIds.map((locationId) => {
            const location = locationMap[locationId];
            if (!location) return null;
            return (
              <ListItem
                key={locationId}
                onClick={() => {
                  setOpenLocationId(locationId);
                  setMultiLocationChooserState({
                    open: false,
                    locationIds: [],
                  });
                }}
                disablePadding
              >
                <ListItemButton onClick={() => setOpenLocationId(locationId)}>
                  <ListItemAvatar>
                    <LocationItemAvatar location={location} />
                  </ListItemAvatar>
                  <ListItemText>{location.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </Menu>
        <MapToolChooser
          currentTool={mapTool}
          setCurrentTool={setMapTool}
          locations={locationMap}
          currentLocationId={locationId}
        />
      </Box>
    </Box>
  );
}

const getConnections = (
  mapItems: ILocationMap,
  row: number,
  col: number,
  locationId: string,
  locations: Record<string, LocationWithGMProperties>
) => {
  const isEvenRow = row % 2 === 0;

  // Default connections
  const connections: LocationHexagonProps["pathConnections"] = {
    topLeft: false,
    topRight: false,
    left: false,
    right: false,
    bottomLeft: false,
    bottomRight: false,
  };

  // Check if there is a hexagon in the given direction
  const hasHexagon = (r: number, c: number): boolean => {
    const entry = mapItems[r]?.[c];
    if (!entry) return false;

    if (entry.type === MapEntryType.Path) return true;
    else if (entry.type === MapEntryType.Location)
      return checkIsLocationCell(entry, locationId, locations);
    return !!mapItems[r]?.[c]?.type;
  };

  if (isEvenRow) {
    connections.topLeft = hasHexagon(row - 1, col - 1);
    connections.topRight = hasHexagon(row - 1, col);
    connections.left = hasHexagon(row, col - 1);
    connections.right = hasHexagon(row, col + 1);
    connections.bottomLeft = hasHexagon(row + 1, col - 1);
    connections.bottomRight = hasHexagon(row + 1, col);
  } else {
    connections.topLeft = hasHexagon(row - 1, col);
    connections.topRight = hasHexagon(row - 1, col + 1);
    connections.left = hasHexagon(row, col - 1);
    connections.right = hasHexagon(row, col + 1);
    connections.bottomLeft = hasHexagon(row + 1, col);
    connections.bottomRight = hasHexagon(row + 1, col + 1);
  }

  return connections;
};