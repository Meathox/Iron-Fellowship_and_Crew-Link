import {
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
} from "@mui/material";
import HomebrewIcon from "@mui/icons-material/PlaylistAdd";
import { useState } from "react";
import { ExpansionSelectorDialog } from "components/features/charactersAndCampaigns/ExpansionSelector/ExpansionSelectorDialog";
import { useStore } from "stores/store";
import { useConfirm } from "material-ui-confirm";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  CHARACTER_ROUTES,
  constructCharacterCardUrl,
  constructCharacterPath,
} from "pages/Character/routes";
import { useSnackbar } from "providers/SnackbarProvider";
import LinkIcon from "@mui/icons-material/Link";
import PortraitIcon from "@mui/icons-material/AccountCircle";
import { ChangeNamePortraitDialog } from "./ChangeNamePortraitDialog";
import StatIcon from "@mui/icons-material/Numbers";
import { UpdateStatDialog } from "./UpdateStatDialog";
import { useCampaignType } from "hooks/useCampaignType";
import ThemeIcon from "@mui/icons-material/ColorLens";
import { ThemeChooserDialog } from "components/shared/Layout/ThemeChooserDialog";
import LayoutIcon from "@mui/icons-material/ViewComfy";
import { LayoutChooserDialog } from "components/shared/Layout/LayoutChooserDialog";

export interface CharacterSettingsMenuProps {
  open: boolean;
  onClose: () => void;
  anchorElement: HTMLElement | null;
}

export function CharacterSettingsMenu(props: CharacterSettingsMenuProps) {
  const { open, onClose, anchorElement } = props;

  const navigate = useNavigate();
  const confirm = useConfirm();
  const { success } = useSnackbar();

  const [expansionSelectorDialogOpen, setExpansionSelectorDialogOpen] =
    useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [layoutDialogOpen, setLayoutDialogOpen] = useState(false);

  const [changeNamePortraitDialogOpen, setChangeNamePortraitDialogOpen] =
    useState(false);

  const [updateStatDialogOpen, setUpdateStatDialogOpen] = useState(false);

  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const characterName = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.name ?? ""
  );

  const { showGuidedPlayerView } = useCampaignType();

  const deleteCharacter = useStore((store) => store.characters.deleteCharacter);
  const handleDeleteCharacter = (characterId: string) => {
    confirm({
      title: "Delete Character",
      description: `Are you sure you want to delete ${characterName}?`,
      confirmationText: "Delete",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteCharacter(characterId)
          .then(() => {
            navigate(constructCharacterPath(CHARACTER_ROUTES.SELECT));
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  const copyOBSLinkToClipboard = () => {
    navigator.clipboard
      .writeText(
        window.location.origin + constructCharacterCardUrl(characterId ?? "")
      )
      .then(() => {
        success("Copied Link to Clipboard");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <Menu
        open={open}
        onClose={onClose}
        anchorEl={anchorElement}
        MenuListProps={{
          subheader: (
            <ListSubheader component={"div"} disableSticky>
              Character Settings
            </ListSubheader>
          ),
        }}
      >
        <MenuItem
          onClick={() => {
            onClose();
            setChangeNamePortraitDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <PortraitIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText>Change Name or Portrait</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClose();
            setUpdateStatDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <StatIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText>Update Stats</ListItemText>
        </MenuItem>
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              setExpansionSelectorDialogOpen(true);
              onClose();
            }}
          >
            <ListItemIcon>
              <HomebrewIcon fontSize={"small"} />
            </ListItemIcon>
            <ListItemText>Expansions & Homebrew</ListItemText>
          </MenuItem>
        )}
        {!showGuidedPlayerView && (
          <MenuItem
            onClick={() => {
              onClose();
              setThemeDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <ThemeIcon />
            </ListItemIcon>
            <ListItemText>Change Theme</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            onClose();
            setLayoutDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <LayoutIcon />
          </ListItemIcon>
          <ListItemText>Change Layout</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClose();
            handleDeleteCharacter(characterId ?? "");
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText>Delete Character</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            copyOBSLinkToClipboard();
            onClose();
          }}
        >
          <ListItemIcon>
            <LinkIcon fontSize={"small"} />
          </ListItemIcon>
          <ListItemText>OBS Overlay Link</ListItemText>
        </MenuItem>
      </Menu>
      <ExpansionSelectorDialog
        open={expansionSelectorDialogOpen}
        onClose={() => setExpansionSelectorDialogOpen(false)}
      />
      <ChangeNamePortraitDialog
        open={changeNamePortraitDialogOpen}
        onClose={() => setChangeNamePortraitDialogOpen(false)}
      />
      <UpdateStatDialog
        open={updateStatDialogOpen}
        onClose={() => setUpdateStatDialogOpen(false)}
      />
      <ThemeChooserDialog
        open={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
      />
      <LayoutChooserDialog
        open={layoutDialogOpen}
        onClose={() => setLayoutDialogOpen(false)}
      />
    </>
  );
}
