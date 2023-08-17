import { Box, Button, Paper, TextField } from "@mui/material";
import { Formik } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SectionHeading } from "components/SectionHeading";
import { StoredAsset } from "types/Asset.type";
import { Stat } from "types/stats.enum";
import { AssetsSection } from "./components/AssetsSection";
import { StatsField } from "./components/StatsField";
import { StatsMap } from "types/Character.type";
import { PageHeader } from "components/Layout/PageHeader";
import { PageContent } from "components/Layout";
import {
  CAMPAIGN_ROUTES,
  constructCampaignSheetPath,
} from "pages/Campaign/routes";
import { constructCharacterSheetPath } from "../routes";
import { TextFieldWithOracle } from "components/TextFieldWithOracle/TextFieldWithOracle";
import { useRoller } from "providers/DieRollProvider";
import { useCallback, useState } from "react";
import { Head } from "providers/HeadProvider/Head";
import { useStore } from "stores/store";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";

export type AssetArrayType = [
  StoredAsset | undefined,
  StoredAsset | undefined,
  StoredAsset | undefined
];

type CharacterCreateFormValues = {
  name: string;
  stats: { [key in Stat]: number | undefined };
  assets: AssetArrayType;
};

const nameOracles = [
  "ironsworn/oracles/name/ironlander/a",
  "ironsworn/oracles/name/ironlander/b",
];

export function CharacterCreatePage() {
  const campaignId = useSearchParams()[0].get("campaignId");
  const uid = useStore((store) => store.auth.uid);

  const navigate = useNavigate();
  const { rollOracleTable } = useRoller();

  const [createCharacterLoading, setCreateCharacterLoading] =
    useState<boolean>(false);
  const createCharacter = useStore((store) => store.characters.createCharacter);

  const handleOracleRoll = useCallback(() => {
    const oracleIndex = Math.floor(Math.random() * nameOracles.length);
    return rollOracleTable(nameOracles[oracleIndex], false);
  }, [rollOracleTable]);

  const validate = (values: CharacterCreateFormValues) => {
    const errors: { [key in keyof CharacterCreateFormValues]?: string } = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (
      !values.stats[Stat.Edge] ||
      !values.stats[Stat.Iron] ||
      !values.stats[Stat.Heart] ||
      !values.stats[Stat.Shadow] ||
      !values.stats[Stat.Wits]
    ) {
      errors.stats = "Stats are required";
    }

    if (!values.assets[0] || !values.assets[1] || !values.assets[2]) {
      errors.assets = "Assets are required";
    }

    return errors;
  };

  const handleSubmit = (values: CharacterCreateFormValues) => {
    setCreateCharacterLoading(true);
    createCharacter(
      values.name,
      values.stats as StatsMap,
      values.assets as [StoredAsset, StoredAsset, StoredAsset]
    )
      .then((characterId) => {
        if (campaignId) {
          addCharacterToCampaign({ uid, campaignId, characterId }).finally(
            () => {
              // add character to campaign
              navigate(
                constructCampaignSheetPath(campaignId, CAMPAIGN_ROUTES.SHEET)
              );
            }
          );
        } else {
          navigate(constructCharacterSheetPath(characterId));
        }
      })
      .catch(() => {})
      .finally(() => setCreateCharacterLoading(false));
  };

  return (
    <>
      <Head
        title={"Create a Character"}
        description={"Create an Ironsworn character on Iron Fellowship"}
      />
      <PageHeader label={"Create your Character"} />
      <PageContent isPaper>
        <Formik
          initialValues={{
            name: "",
            stats: {
              [Stat.Edge]: undefined,
              [Stat.Heart]: undefined,
              [Stat.Iron]: undefined,
              [Stat.Shadow]: undefined,
              [Stat.Wits]: undefined,
            },
            assets: [undefined, undefined, undefined],
          }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {(form) => (
            <form onSubmit={form.handleSubmit}>
              <SectionHeading breakContainer label={"Character Details"} />
              <div>
                <TextFieldWithOracle
                  getOracleValue={() => handleOracleRoll() ?? ""}
                  label={"Name"}
                  name={"name"}
                  value={form.values.name}
                  onChange={(value) => form.setFieldValue("name", value)}
                  error={form.touched.name && !!form.errors.name}
                  helperText={form.touched.name && form.errors.name}
                  sx={{ maxWidth: 350, mt: 2 }}
                  fullWidth
                />
              </div>
              <StatsField />
              <AssetsSection />
              <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
                <Button
                  type={"submit"}
                  variant={"contained"}
                  disabled={createCharacterLoading}
                >
                  Create Character
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </PageContent>
    </>
  );
}
