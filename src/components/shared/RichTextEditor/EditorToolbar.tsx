import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { Editor } from "@tiptap/react";
import { TextTypeDropdown } from "./TextTypeDropdown";
import BoldIcon from "@mui/icons-material/FormatBold";
import ItalicIcon from "@mui/icons-material/FormatItalic";
import StrikeThroughIcon from "@mui/icons-material/FormatStrikethrough";
import QuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BulletListIcon from "@mui/icons-material/FormatListBulleted";
import NumberedListIcon from "@mui/icons-material/FormatListNumbered";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";

export interface EditorToolbarProps {
  editor: Editor;
  deleteNote?: () => void;
}

export function EditorToolbar(props: EditorToolbarProps) {
  const { editor, deleteNote } = props;
  const confirm = useConfirm();

  if (!editor) {
    return null;
  }

  const handleDelete = () => {
    confirm({
      title: "Delete Note",
      description:
        "Are you sure you want to delete this note? This action cannot be undone.",
      confirmationText: "Delete Note",
      confirmationButtonProps: {
        variant: "contained",
        color: "error",
      },
    })
      .then(() => {
        deleteNote && deleteNote();
      })
      .catch(() => {});
  };

  return (
    <Box
      display={"flex"}
      flexWrap={"wrap"}
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
      px={2}
      pt={0.5}
      pb={1}
      position={"sticky"}
      top={0}
      bgcolor={(theme) => theme.palette.background.paper}
      zIndex={2}
      sx={(theme) => ({
        borderTopRightRadius: theme.shape.borderRadius,
        borderTopLeftRadius: theme.shape.borderRadius,
      })}
    >
      <TextTypeDropdown editor={editor} sx={{ mt: 0.5 }} />
      <ToggleButtonGroup sx={{ mr: 1, mt: 0.5 }}>
        <Tooltip title={"Bold"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"bold"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            selected={editor.isActive("bold")}
          >
            <BoldIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title={"Italic"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"italic"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            selected={editor.isActive("italic")}
          >
            <ItalicIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title={"Strikethrough"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"strikethrough"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            selected={editor.isActive("strike")}
          >
            <StrikeThroughIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
      <ToggleButtonGroup sx={{ mr: 1, mt: 0.5 }}>
        <Tooltip title={"Bulleted List"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"bullet list"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            selected={editor.isActive("bulletList")}
          >
            <BulletListIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={"Numbered List"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"number list"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            selected={editor.isActive("orderedList")}
          >
            <NumberedListIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={"Horizontal Rule"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"horizontal rule"}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <HorizontalRuleIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={"Quote"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"quote"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <QuoteIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
      {deleteNote && (
        <Tooltip title={"Delete Note"} enterDelay={300}>
          <ToggleButton
            size={"small"}
            value={"deleteNote"}
            onClick={() => handleDelete()}
            sx={{ mt: 0.5 }}
          >
            <DeleteIcon />
          </ToggleButton>
        </Tooltip>
      )}
    </Box>
  );
}
