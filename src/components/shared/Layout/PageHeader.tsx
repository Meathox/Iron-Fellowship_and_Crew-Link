import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { Border } from "assets/Border";
import { getPublicAssetPath } from "functions/getPublicAssetPath";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import React, { PropsWithChildren } from "react";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export interface PageHeaderProps extends PropsWithChildren {
  label?: string | React.ReactNode;
  subLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { label, subLabel, actions, children } = props;

  const isEmpty = !label && !subLabel && !actions && !children;

  const isLightTheme = useTheme().palette.mode === "light";

  const isIronsworn = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: true,
    [GAME_SYSTEMS.STARFORGED]: false,
  });

  const borderUrl = getPublicAssetPath("border.svg");

  return (
    <>
      <Box
        sx={(theme) => ({
          color: theme.palette.darkGrey.contrastText,
          pt: isEmpty ? 0 : 4,
          pb: isEmpty ? 8 : 10,
          mb: isEmpty ? -8 : -4,
          width: "100vw",
          backgroundColor: isLightTheme
            ? theme.palette.darkGrey.main
            : undefined,
          position: "relative",
        })}
      >
        <Container
          maxWidth={"xl"}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {children ? (
            <>{children}</>
          ) : (
            <>
              <Box>
                {label &&
                  (typeof label === "string" ? (
                    <Typography
                      variant={"h4"}
                      component={"h1"}
                      fontFamily={(theme) => theme.fontFamilyTitle}
                    >
                      {label}
                    </Typography>
                  ) : (
                    label
                  ))}
                {subLabel && (
                  <Typography
                    variant={"h6"}
                    component={"h2"}
                    fontFamily={(theme) => theme.fontFamilyTitle}
                  >
                    {subLabel}
                  </Typography>
                )}
              </Box>
              {actions && (
                <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
                  {actions}
                </Stack>
              )}
            </>
          )}
        </Container>
        <Box
          sx={(theme) => ({
            backgroundImage: isLightTheme ? `url("${borderUrl}")` : undefined,
            position: "absolute",
            top: "100%",
            mt: "-1px",
            mx: -2,
            transform: isIronsworn ? "rotate(180deg)" : undefined,
            height: theme.spacing(8),
            backgroundRepeat: "repeat-x",
            backgroundSize: "contain",
            backgroundPositionY: isIronsworn ? "bottom" : undefined,
            minWidth: isIronsworn ? 1000 : 500,
            width: "110%",
          })}
        />
      </Box>
    </>
  );
}
