import {
  Alert,
  Box,
  Button,
  Fab,
  Grid,
  Hidden,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "components/shared/EmptyState/EmptyState";
import AddWorldIcon from "@mui/icons-material/Add";
import { constructWorldSheetPath } from "../routes";
import { PageContent, PageHeader } from "components/shared/Layout";
import { WorldCard } from "./components/WorldCard";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { shallow } from "zustand/shallow";

export function WorldSelectPage() {
  const worldIds = useStore(
    (store) =>
      Object.keys(store.worlds.worldMap).sort((w1, w2) => {
        const world1 = store.worlds.worldMap[w1];
        const world2 = store.worlds.worldMap[w2];
        const uid = store.auth.uid;

        const isWorldOwnerOfW1 = world1.ownerIds.includes(uid);
        const isWorldOwnerOfW2 = world2.ownerIds.includes(uid);

        if (isWorldOwnerOfW1 && !isWorldOwnerOfW2) {
          return -1;
        } else if (!isWorldOwnerOfW1 && isWorldOwnerOfW2) {
          return 1;
        } else {
          return world1.name.localeCompare(world2.name);
        }
      }),
    shallow
  );
  const loading = useStore((store) => store.worlds.loading);
  const error = useStore((store) => store.worlds.error);

  const navigate = useNavigate();

  const createWorld = useStore((store) => store.worlds.createWorld);
  const handleWorldCreate = () => {
    createWorld()
      .then((worldId) => {
        navigate(constructWorldSheetPath(worldId));
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <LinearProgress
        sx={{
          width: "100vw",
          position: "absolute",
          left: 0,
          marginTop: -3,
        }}
      />
    );
  }

  return (
    <>
      <Head
        title={"Your Worlds"}
        description="A list of all of your worlds or worlds in campaigns you've joined."
      />
      <PageHeader
        label={"Your Worlds"}
        actions={
          <Hidden smDown>
            <Button
              variant={"contained"}
              color={"primary"}
              endIcon={<AddWorldIcon />}
              onClick={() => handleWorldCreate()}
            >
              Create a World
            </Button>
          </Hidden>
        }
      />
      <PageContent isPaper={!worldIds || worldIds.length === 0}>
        {error && <Alert>Error loading your worlds.</Alert>}
        {!worldIds || worldIds.length === 0 ? (
          <EmptyState
            showImage
            title={"Create your First World"}
            message={
              "Worlds allow you to share location notes and truths across multiple characters or campaigns."
            }
            callToAction={
              <Button
                onClick={handleWorldCreate}
                variant={"contained"}
                endIcon={<AddWorldIcon />}
              >
                Create a World
              </Button>
            }
          />
        ) : (
          <Grid container spacing={2}>
            {worldIds.map((worldId, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <WorldCard worldId={worldId} />
              </Grid>
            ))}
          </Grid>
        )}
        <Hidden smUp>
          <Box height={80} />
        </Hidden>
        <Hidden smUp>
          <Fab
            color={"primary"}
            sx={(theme) => ({
              position: "fixed",
              bottom: theme.spacing(9),
              right: theme.spacing(2),
            })}
            onClick={() => handleWorldCreate()}
          >
            <AddWorldIcon />
          </Fab>
        </Hidden>
      </PageContent>
    </>
  );
}
