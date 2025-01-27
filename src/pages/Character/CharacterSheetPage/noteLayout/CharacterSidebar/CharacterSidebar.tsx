import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUpdateQueryStringValueWithoutNavigation } from "hooks/useUpdateQueryStringValueWithoutNavigation";
import {
  ContainedTabPanel,
  StyledTab,
  StyledTabs,
} from "components/shared/StyledTabs";
import { CharacterPanel } from "./CharacterPanel";
import { TracksPanel } from "./TracksPanel";
import { AssetsPanel } from "./AssetsPanel";

enum Tabs {
  Character = "character",
  Tracks = "tracks",
  Assets = "assets",
}

export function CharacterSidebar() {
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<Tabs>(
    (searchParams.get("characterTab") as Tabs) ?? Tabs.Character
  );
  const handleTabChange = (tab: Tabs) => {
    setSelectedTab(tab);
  };

  useUpdateQueryStringValueWithoutNavigation("characterTab", selectedTab);

  return (
    <>
      <StyledTabs
        value={selectedTab}
        onChange={(evt, value) => handleTabChange(value)}
        sx={{ mx: -2 }}
      >
        <StyledTab label="Character" value={Tabs.Character} />
        <StyledTab label="Tracks" value={Tabs.Tracks} />
        <StyledTab label="Assets" value={Tabs.Assets} />
      </StyledTabs>

      <ContainedTabPanel
        overflowAuto={false}
        isVisible={selectedTab === Tabs.Character}
      >
        <CharacterPanel />
      </ContainedTabPanel>
      <ContainedTabPanel
        overflowAuto={false}
        isVisible={selectedTab === Tabs.Tracks}
      >
        <TracksPanel />
      </ContainedTabPanel>
      <ContainedTabPanel
        overflowAuto={false}
        isVisible={selectedTab === Tabs.Assets}
      >
        <AssetsPanel />
      </ContainedTabPanel>
    </>
  );
}
