import { useRouteError } from "react-router-dom";
import { EmptyState } from "./EmptyState";
import { useAppName } from "hooks/useAppName";
import { useEffect, useState } from "react";
import { reportPageError } from "lib/analytics.lib";
import { Box } from "@mui/material";

const supportEmail = "support@scottbenton.dev";

export function ErrorRoute() {
  const error = useRouteError();
  const [errorMessage, setErrorMessage] = useState<string>();

  const appName = useAppName();

  useEffect(() => {
    let errorMessage: string | undefined = undefined;
    let errorTrace: string | undefined = undefined;

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorTrace = error.stack;
    }

    // The App has updated in the background, lets grab the new versions of the pages by refreshing
    if (
      errorMessage?.includes("Failed to fetch dynamically imported module") ||
      errorMessage?.includes(
        "'text/html' is not a valid JavaScript MIME type."
      ) ||
      errorMessage?.includes("Importing a module script failed.") ||
      errorMessage
        ?.toLocaleLowerCase()
        .includes("error loading dynamically imported module")
    ) {
      window.location.reload();
    } else {
      setErrorMessage(errorMessage);
      reportPageError(
        errorMessage ?? "Could not extract error message.",
        errorTrace,
        location.pathname
      );
    }
  }, [error]);

  return (
    <EmptyState
      showImage
      title={`${appName} encountered an error`}
      message={
        <>
          <Box component={"span"} display={"block"}>
            Sorry for the inconvenience! If you are having trouble accessing the
            app, please reach out on the discord, or by emailing{" "}
            <b>{supportEmail}</b> with a description of the error.
          </Box>
          {errorMessage && (
            <Box component={"span"} display={"block"}>
              Please include the following in your message: {errorMessage}
            </Box>
          )}
        </>
      }
    />
  );
}
