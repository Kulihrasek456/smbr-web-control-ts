import { Show } from "solid-js";
import { GridstackGrid, GridElement } from "../../common/GridstackGrid/GridstackGrid.tsx";
import { countInstancesOfType, useModuleListValue } from "../../common/other/ModuleListProvider.tsx";
import { Control } from "../dashboard/Control.tsx";
import { Temperature } from "../dashboard/Temperature.tsx";
import { DeviceInformation } from "./DeviceInformation.tsx";
import { ModuleListDisplay } from "./ModuleList.tsx";
import { ServicesStatus } from "./ServiceStatus.tsx";
import { CanStatistics } from "./CanStatistics.tsx";

export function Device() {
  const moduleListCntxt = useModuleListValue();
  

  return (
    <div style={{ padding: "8px" }}>
      <GridstackGrid>
          <ModuleListDisplay id="moduleList"></ModuleListDisplay>
          <ServicesStatus id="serviceStatus"></ServicesStatus>
          <Show when={countInstancesOfType(moduleListCntxt?.state(),"core","Exclusive")}>
            <DeviceInformation id="deviceInformation"></DeviceInformation>
          </Show>
          <CanStatistics id="canStatistics"></CanStatistics>
      </GridstackGrid>
    </div>
  );
}
